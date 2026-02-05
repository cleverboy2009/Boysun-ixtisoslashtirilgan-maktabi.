$ErrorActionPreference = "Stop"
try {
    $content = Get-Content -Path "teacher_data.js" -Raw -Encoding UTF8
} catch {
    Write-Host "Error reading file"
    exit 1
}

# Remove JS specific syntax
$content = $content -replace "const\s+teacherData\s*=\s*", ""
$content = $content.Trim()
if ($content.EndsWith(";")) { $content = $content.Substring(0, $content.Length - 1) }

# Quote unquoted keys (name:, subject:, schedule:)
# We use negative lookbehind (?<!") to avoid double quoting
$content = $content -replace '(?<!")(\b\w+\b):', '"$1":'

# Remove trailing commas
$content = $content -replace ',(\s*\])', '$1'
$content = $content -replace ',(\s*\})', '$1'

try {
    $data = $content | ConvertFrom-Json
} catch {
    Write-Host "JSON Parse Error: $_"
    exit 1
}

$timetable = @{}
$subjectsMap = @{
    "Matematika" = "M"; "Informatika" = "I"; "Tarbiya" = "T";
    "Rus tili" = "R"; "Geografiya" = "G"; "Jismoniy tarbiya" = "J";
    "Kimyo" = "K"; "Biologiya" = "B"; "Fizika" = "F";
    "Ingliz tili" = "Ct"; "Ona tili" = "On"; "Tasviriy san'at" = "Ar";
    "Tarix" = "Tr"; "Texnologiya" = "Tx"; "Chizmachilik" = "C";
    "ChQBT" = "Q"; "O'zbekiston tarixi" = "O"; "Jahon tarixi" = "Jh";
    "Adabiyot" = "Ad"
}

foreach ($teacher in $data) {
    if (-not $teacher) { continue }
    $subj = $teacher.subject
    $code = if ($subjectsMap.ContainsKey($subj)) { $subjectsMap[$subj] } else { $subj }
    
    $schedule = $teacher.schedule
    # Get properties (days)
    $days = $schedule | Get-Member -MemberType NoteProperty | Select-Object -ExpandProperty Name
    
    foreach ($day in $days) {
        if ($day -eq "Shanba") { continue }
        $lessons = $schedule.$day
        
        # lessons is array or list
        for ($i = 0; $i -lt $lessons.Count; $i++) {
            $cls = $lessons[$i]
            if (-not $cls) { continue }
            $cls = $cls.ToString().Trim().ToUpper().Replace(" ", "")
            if ($cls -eq "") { continue }

            # Normalize 5A -> 5-A
            if ($cls -match "^(\d+)([A-Z])$") {
                $cls = "$($matches[1])-$($matches[2])"
            }
            
            if (-not $timetable.ContainsKey($cls)) { $timetable[$cls] = @{} }
            if (-not $timetable[$cls].ContainsKey($day)) { $timetable[$cls][$day] = @{} }
            
            $h = ($i + 1).ToString()
            
            if ($timetable[$cls][$day].ContainsKey($h)) {
                $prev = $timetable[$cls][$day][$h]
                $parts = $prev.Split("/")
                if ($parts -notcontains $code) {
                    $timetable[$cls][$day][$h] = "$prev/$code"
                }
            } else {
                $timetable[$cls][$day][$h] = $code
            }
        }
    }
}

$final = @{}
$daysOrder = @("Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma")

$sortedClasses = $timetable.Keys | Sort-Object
foreach ($cls in $sortedClasses) {
    $final[$cls] = @{}
    foreach ($day in $daysOrder) {
        if ($timetable[$cls].ContainsKey($day)) {
            $list = @()
            $hours = $timetable[$cls][$day].Keys | Sort-Object {[int]$_}
            foreach ($h in $hours) {
                $val = $timetable[$cls][$day][$h]
                # Create array [hour, val]
                $pair = @($h, $val)
                $list += ,$pair
            }
            $final[$cls][$day] = $list
        }
    }
}

$final | ConvertTo-Json -Depth 10 -Compress
