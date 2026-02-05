<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Security: Simple authentication
function checkAuth() {
    $headers = getallheaders();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    
    if (strpos($authHeader, 'Bearer ') === 0) {
        $token = substr($authHeader, 7);
        // Simple token validation (in production, use proper JWT)
        return $token === 'admin_token_boysun2026';
    }
    
    return false;
}

// Login endpoint
if ($_SERVER['REQUEST_URI'] === '/api/auth/login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if ($data['username'] === 'admin' && $data['password'] === 'boysun2026') {
        echo json_encode([
            'success' => true,
            'token' => 'admin_token_boysun2026',
            'sessionId' => bin2hex(random_bytes(16)),
            'user' => [
                'username' => 'admin',
                'role' => 'admin'
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
    }
    exit();
}

// Get timetable data
if ($_SERVER['REQUEST_URI'] === '/api/timetable' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!checkAuth()) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit();
    }
    
    $dataFile = __DIR__ . '/timetable-data.js';
    if (file_exists($dataFile)) {
        $content = file_get_contents($dataFile);
        
        // Extract timetableData object from JS file
        preg_match('/timetableData:\s*({[\s\S]*?})\s*,\s*\/\/\s*Save/', $content, $matches);
        
        if (isset($matches[1])) {
            // Convert JS object to JSON
            $jsonData = $matches[1];
            echo $jsonData;
        } else {
            echo json_encode([]);
        }
    } else {
        echo json_encode([]);
    }
    exit();
}

// Update timetable data
if ($_SERVER['REQUEST_URI'] === '/api/timetable' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!checkAuth()) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit();
    }
    
    $newData = json_decode(file_get_contents('php://input'), true);
    
    if (!$newData) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data']);
        exit();
    }
    
    // Update timetable-data.js
    $dataFile = __DIR__ . '/timetable-data.js';
    $content = file_get_contents($dataFile);
    
    // Convert new data to formatted JSON
    $formattedData = json_encode($newData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
    // Replace timetableData in the file
    $pattern = '/(timetableData:\s*){[\s\S]*?}(\s*,\s*\/\/\s*Save)/';
    $replacement = '$1' . $formattedData . '$2';
    $newContent = preg_replace($pattern, $replacement, $content);
    
    // Create backup
    $backupFile = __DIR__ . '/backups/timetable-data-' . date('Y-m-d-H-i-s') . '.js';
    @mkdir(__DIR__ . '/backups', 0755, true);
    file_put_contents($backupFile, $content);
    
    // Write new content
    if (file_put_contents($dataFile, $newContent)) {
        echo json_encode(['success' => true, 'message' => 'Timetable updated successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to write file']);
    }
    exit();
}

// Get teacher data
if ($_SERVER['REQUEST_URI'] === '/api/teachers' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!checkAuth()) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit();
    }
    
    $teacherFile = __DIR__ . '/teacher_data.js';
    if (file_exists($teacherFile)) {
        $content = file_get_contents($teacherFile);
        
        // Extract teacherData array
        preg_match('/const\s+teacherData\s*=\s*(\[[\s\S]*?\]);/', $content, $matches);
        
        if (isset($matches[1])) {
            echo $matches[1];
        } else {
            echo json_encode([]);
        }
    } else {
        echo json_encode([]);
    }
    exit();
}

// Update teacher data
if ($_SERVER['REQUEST_URI'] === '/api/teachers' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!checkAuth()) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit();
    }
    
    $newData = json_decode(file_get_contents('php://input'), true);
    
    if (!$newData) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data']);
        exit();
    }
    
    // Update teacher_data.js
    $teacherFile = __DIR__ . '/teacher_data.js';
    $formattedData = json_encode($newData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
    $newContent = "const teacherData = " . $formattedData . ";";
    
    // Create backup
    $backupFile = __DIR__ . '/backups/teacher_data-' . date('Y-m-d-H-i-s') . '.js';
    @mkdir(__DIR__ . '/backups', 0755, true);
    if (file_exists($teacherFile)) {
        file_put_contents($backupFile, file_get_contents($teacherFile));
    }
    
    // Write new content
    if (file_put_contents($teacherFile, $newContent)) {
        echo json_encode(['success' => true, 'message' => 'Teacher data updated successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to write file']);
    }
    exit();
}

// Validate session
if ($_SERVER['REQUEST_URI'] === '/api/auth/validate' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    if (checkAuth()) {
        echo json_encode(['valid' => true]);
    } else {
        http_response_code(401);
        echo json_encode(['valid' => false]);
    }
    exit();
}

// Default response
http_response_code(404);
echo json_encode(['error' => 'Endpoint not found']);
?>
