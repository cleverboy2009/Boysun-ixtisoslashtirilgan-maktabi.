<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(); }

$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
if (strpos($path, 'api.php') !== false) {
    $parts = explode('api.php', $path);
    $path = end($parts);
}

function checkAuth() {
    $headers = getallheaders();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    return strpos($authHeader, 'Bearer admin_token_boysun2026') !== false;
}

// 1. Login
if ($path === '/api/auth/login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if ($data['username'] === 'admin' && $data['password'] === 'boysun2026') {
        echo json_encode(['success' => true, 'token' => 'admin_token_boysun2026']);
    } else { http_response_code(401); }
    exit();
}

// 2. GET Timetable
if ($path === '/api/timetable' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $content = file_get_contents(__DIR__ . '/timetable-data.js');
    preg_match('/timetableData:\s*{(.*?)},\s*\/\/\s*Save/s', $content, $matches);
    echo isset($matches[1]) ? '{' . $matches[1] . '}' : json_encode([]);
    exit();
}

// 3. POST Timetable (Save to File)
if ($path === '/api/timetable' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!checkAuth()) { http_response_code(401); exit(); }
    $newData = json_decode(file_get_contents('php://input'), true);
    $formatted = json_encode($newData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
    $file = __DIR__ . '/timetable-data.js';
    $content = file_get_contents($file);
    // Strict replacement
    $newContent = preg_replace('/(timetableData:\s*){.*?}(\s*,\s*\/\/\s*Save)/s', "$1" . $formatted . "$2", $content);
    
    if ($newContent && file_put_contents($file, $newContent)) {
        echo json_encode(['success' => true]);
    } else { http_response_code(500); }
    exit();
}

// 4. GET Teachers
if ($path === '/api/teachers' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $content = file_get_contents(__DIR__ . '/teacher_data.js');
    preg_match('/const\s+teacherData\s*=\s*(.*);/s', $content, $matches);
    echo isset($matches[1]) ? $matches[1] : json_encode([]);
    exit();
}

// 5. POST Teachers (Save to File)
if ($path === '/api/teachers' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!checkAuth()) { http_response_code(401); exit(); }
    $newData = json_decode(file_get_contents('php://input'), true);
    $formatted = json_encode($newData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
    $file = __DIR__ . '/teacher_data.js';
    $newContent = "const teacherData = " . $formatted . ";";
    
    if (file_put_contents($file, $newContent)) {
        echo json_encode(['success' => true]);
    } else { http_response_code(500); }
    exit();
}

http_response_code(404);
?>
