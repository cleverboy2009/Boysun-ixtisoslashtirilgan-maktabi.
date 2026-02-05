import json
import re

try:
    with open('teacher_data.js', 'r', encoding='utf-8') as f:
        content = f.read()
except FileNotFoundError:
    print("teacher_data.js not found")
    exit(1)

# Extract array bracket to bracket
start = content.find('[')
end = content.rfind(']') + 1
json_str = content[start:end]

# Fix keys to be valid JSON
# keys: name, subject, schedule are unquoted.
# Keys inside schedule are quoted (e.g. "Dushanba")
# We only quote name, subject, schedule if they are unquoted.
# Simple replace is safer than regex for these specific keys
json_str = json_str.replace('name:', '"name":')
json_str = json_str.replace('subject:', '"subject":')
json_str = json_str.replace('schedule:', '"schedule":')

# Remove trailing commas? JSON standard doesn't allow them.
# e.g. ["a", "b",] -> ["a", "b"]
json_str = re.sub(r',\s*\]', ']', json_str)
json_str = re.sub(r',\s*\}', '}', json_str)

try:
    data = json.loads(json_str)
except json.JSONDecodeError as e:
    print(f"JSON Parse Error: {e}")
    # Fallback: simple evaluation? No, security risk and python doesn't match JS syntax 1:1
    exit(1)

subjects_map = {
    "Matematika": "M",
    "Informatika": "I",
    "Tarbiya": "T",
    "Rus tili": "R",
    "Geografiya": "G",
    "Jismoniy tarbiya": "J",
    "Kimyo": "K",
    "Biologiya": "B",
    "Fizika": "F",
    "Ingliz tili": "Ct",
    "Ona tili": "On",
    "Tasviriy san'at": "Ar",
    "Tarix": "Tr",
    "Texnologiya": "Tx", # New code
    "Chizmachilik": "C",
    "ChQBT": "Q",
    "O'zbekiston tarixi": "O",
    "Jahon tarixi": "Jh",
    "Adabiyot": "Ad"
}

timetable = {}

for teacher in data:
    subj = teacher['subject']
    code = subjects_map.get(subj, subj)
    
    for day, lessons in teacher['schedule'].items():
        if day == "Shanba": continue # Optional: skip saturday if not needed, or keep. I'll keep if data exists.
        
        for i, cls in enumerate(lessons):
            if not cls or cls == "": continue
            
            # Normalize class
            cls = cls.strip().upper()
            
            # Corrections: "5A" -> "5-A"
            # Regex to find NumberLetter
            # If it's 5-A already, good. If 5A, insert dash.
            if re.match(r'^\d+[ABVDEabvde]$', cls):
                 cls = cls[:-1] + "-" + cls[-1]
            
            if cls not in timetable:
                timetable[cls] = {}
            if day not in timetable[cls]:
                timetable[cls][day] = {}
            
            hour = str(i + 1)
            
            if hour in timetable[cls][day]:
                 prev = timetable[cls][day][hour]
                 if code not in prev.split("/"):
                     timetable[cls][day][hour] = f"{prev}/{code}"
            else:
                timetable[cls][day][hour] = code

final_data = {}
days_order = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"]

for cls in sorted(timetable.keys()):
    final_data[cls] = {}
    for day in days_order:
        if day in timetable[cls]:
            lessons_list = []
            sorted_hours = sorted(timetable[cls][day].keys(), key=lambda x: int(x))
            for h in sorted_hours:
                lessons_list.append([h, timetable[cls][day][h]])
            if lessons_list:
                final_data[cls][day] = lessons_list

print(json.dumps(final_data, indent=4, ensure_ascii=False))
