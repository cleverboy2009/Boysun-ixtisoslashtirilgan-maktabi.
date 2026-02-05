cmake_minimum_required(VERSION 3.15)
project(TimetableSecureServer)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Security flags
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Wextra -Werror")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fstack-protector-strong")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -D_FORTIFY_SOURCE=2")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fPIE -pie")

# Find required packages
find_package(OpenSSL REQUIRED)
find_package(Threads REQUIRED)

# Include directories
include_directories(${OPENSSL_INCLUDE_DIR})
include_directories(${CMAKE_SOURCE_DIR}/include)

# External libraries (header-only)
include(FetchContent)

# cpp-httplib
FetchContent_Declare(
    httplib
    GIT_REPOSITORY https://github.com/yhirose/cpp-httplib.git
    GIT_TAG v0.14.0
)
FetchContent_MakeAvailable(httplib)

# nlohmann/json
FetchContent_Declare(
    json
    GIT_REPOSITORY https://github.com/nlohmann/json.git
    GIT_TAG v3.11.2
)
FetchContent_MakeAvailable(json)

# jwt-cpp
FetchContent_Declare(
    jwt-cpp
    GIT_REPOSITORY https://github.com/Thalhammer/jwt-cpp.git
    GIT_TAG v0.6.0
)
FetchContent_MakeAvailable(jwt-cpp)

# Executable
add_executable(timetable_server server.cpp)

# Link libraries
target_link_libraries(timetable_server
    PRIVATE
    OpenSSL::SSL
    OpenSSL::Crypto
    Threads::Threads
    httplib::httplib
    nlohmann_json::nlohmann_json
    jwt-cpp::jwt-cpp
)

# Install
install(TARGETS timetable_server DESTINATION bin)
