<?php
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');

// Simple Security: Check if request is AJAX
if(!isset($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
    // In production, you'd handle this more strictly
}

// Load data from JSON
$jsonPath = __DIR__ . '/timetable.json';
if (!file_exists($jsonPath)) {
    echo json_encode(['error' => 'Data file not found']);
    exit;
}

$rawData = json_decode(file_get_contents($jsonPath), true);
$subjects = $rawData['subjects'];
$rawTimetable = $rawData['timetable'];

$finalTimetable = [];

foreach ($rawTimetable as $class => $days) {
    $finalTimetable[$class] = [];
    foreach ($days as $day => $lessons) {
        $finalTimetable[$class][$day] = [];
        foreach ($lessons as $lesson) {
            $finalTimetable[$class][$day][] = [
                'lesson' => $lesson[0],
                'subject' => isset($subjects[$lesson[1]]) ? $subjects[$lesson[1]] : $lesson[1]
            ];
        }
    }
}

echo json_encode($finalTimetable);
?>
