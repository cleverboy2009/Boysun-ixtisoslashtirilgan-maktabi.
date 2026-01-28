/*
 * liquid_logic.cpp - High-Performance News Management Strengthening
 * Provides native-speed logic for sorting and filtering news data.
 */

#include <emscripten/emscripten.h>
#include <string>
#include <vector>
#include <algorithm>

struct NewsItem {
    int id;
    char title[256];
    char date[50];
    int priority;
};

// Global News Cache for fast access
std::vector<NewsItem> news_cache;

extern "C" {
    
    EMSCRIPTEN_KEEPALIVE
    void clear_news() {
        news_cache.clear();
    }

    EMSCRIPTEN_KEEPALIVE
    void add_news_item(int id, const char* title, const char* date, int priority) {
        NewsItem item;
        item.id = id;
        strncpy(item.title, title, 255);
        strncpy(item.date, date, 49);
        item.priority = priority;
        news_cache.push_back(item);
    }

    EMSCRIPTEN_KEEPALIVE
    void sort_news_by_priority() {
        std::sort(news_cache.begin(), news_cache.end(), [](const NewsItem& a, const NewsItem& b) {
            return a.priority > b.priority;
        });
    }

    EMSCRIPTEN_KEEPALIVE
    int get_sorted_id(int index) {
        if (index >= 0 && index < news_cache.size()) {
            return news_cache[index].id;
        }
        return -1;
    }

    EMSCRIPTEN_KEEPALIVE
    const char* get_sorted_title(int index) {
        if (index >= 0 && index < news_cache.size()) {
            return news_cache[index].title;
        }
        return "";
    }
}

int main() {
    return 0;
}
