// lost_found_bot.cpp
#include <iostream>
#include <string>
#include <vector>
#include <map>
#include <unordered_map>
#include <fstream>
#include <sstream>
#include <chrono>
#include <ctime>
#include <iomanip>
#include <algorithm>
#include <filesystem>
#include <memory>
#include <random>

/**
 * Lost and Found Bot - C++ Backend (No SQL)
 * This class provides the core functionality for a lost and found item tracking system
 * using file-based storage instead of SQL.
 */
// Add after the includes, before the class definition
namespace fs = std::filesystem;

class LostFoundBot {
private:
    // File paths for data storage
    const std::string DATA_DIR = "data";
    const std::string LOST_ITEMS_FILE = DATA_DIR + "/lost_items.json";
    const std::string FOUND_ITEMS_FILE = DATA_DIR + "/found_items.json";
    const std::string LOCATIONS_FILE = DATA_DIR + "/locations.json";

    // Location data structure
    struct Location {
        std::string name;
        std::string roomNumber;
        std::string description;
    };
    
    std::vector<Location> predefinedLocations;
    
    // Item category enum
    enum class ItemCategory {
        SMARTPHONE,
        LAPTOP,
        TABLET,
        HEADPHONE,
        SMARTWATCH,
        WALLET,
        KEYS,
        BAG,
        OTHER
    };

    // Category name mapping
    std::map<ItemCategory, std::string> categoryNames = {
        {ItemCategory::SMARTPHONE, "Smartphone"},
        {ItemCategory::LAPTOP, "Laptop"},
        {ItemCategory::TABLET, "Tablet"},
        {ItemCategory::HEADPHONE, "Headphone"},
        {ItemCategory::SMARTWATCH, "Smartwatch"},
        {ItemCategory::WALLET, "Wallet"},
        {ItemCategory::KEYS, "Keys"},
        {ItemCategory::BAG, "Bag"},
        {ItemCategory::OTHER, "Other"}
    };

    // Reverse mapping for string to category
    std::map<std::string, ItemCategory> categoryByName;

    // Category-specific attributes
    std::map<ItemCategory, std::vector<std::string>> categoryAttributes;

    // Data structures for items
    struct Item {
        std::string id;
        std::string personName;
        std::string contactInfo;
        std::string category;
        std::string eventTime; // When lost or found
        std::string location;
        std::string reportTime; // When reported
        std::map<std::string, std::string> details;
        std::string additionalInfo;
        std::string status;
    };

    std::vector<Item> lostItems;
    std::vector<Item> foundItems;

    // Initialize category attributes
    void initCategoryAttributes() {
        // Smartphone attributes
        categoryAttributes[ItemCategory::SMARTPHONE] = {
            "brand", "model", "color", "case_description", "has_lock_screen"
        };
        
        // Laptop attributes
        categoryAttributes[ItemCategory::LAPTOP] = {
            "brand", "model", "color", "has_stickers", "laptop_bag"
        };
        
        // Headphone attributes
        categoryAttributes[ItemCategory::HEADPHONE] = {
            "brand", "model", "color", "wired_wireless", "has_case"
        };
        
        // Tablet attributes
        categoryAttributes[ItemCategory::TABLET] = {
            "brand", "model", "color", "has_case", "screen_size"
        };
        
        // Smartwatch attributes
        categoryAttributes[ItemCategory::SMARTWATCH] = {
            "brand", "model", "color", "band_type"
        };
        
        // Default attributes for other categories
        std::vector<std::string> defaultAttrs = {
            "color", "size", "distinguishing_features"
        };
        
        categoryAttributes[ItemCategory::WALLET] = defaultAttrs;
        categoryAttributes[ItemCategory::KEYS] = defaultAttrs;
        categoryAttributes[ItemCategory::BAG] = defaultAttrs;
        categoryAttributes[ItemCategory::OTHER] = defaultAttrs;

        // Initialize reverse mapping
        for (const auto& pair : categoryNames) {
            categoryByName[pair.second] = pair.first;
        }
    }

    // Get user input with prompt
    std::string getInput(const std::string& prompt) {
        std::string input;
        std::cout << prompt;
        std::getline(std::cin, input);
        return input;
    }

    // Get integer input with validation
    int getIntInput(const std::string& prompt, int min, int max) {
        int input;
        std::string line;
        bool valid = false;

        while (!valid) {
            std::cout << prompt;
            std::getline(std::cin, line);
            
            try {
                input = std::stoi(line);
                if (input >= min && input <= max) {
                    valid = true;
                } else {
                    std::cout << "Please enter a number between " << min << " and " << max << std::endl;
                }
            } catch (const std::exception& e) {
                std::cout << "Invalid input. Please enter a number." << std::endl;
            }
        }
        
        return input;
    }

    // Get item category from user
    ItemCategory getItemCategory() {
        std::cout << "\nSelect item category:" << std::endl;
        int i = 1;
        std::map<int, ItemCategory> categoryMap;
        
        for (const auto& category : categoryNames) {
            std::cout << i << ". " << category.second << std::endl;
            categoryMap[i++] = category.first;
        }
        
        int choice = getIntInput("Enter category number: ", 1, categoryNames.size());
        return categoryMap[choice];
    }

    // Get timestamp from user input
    std::string getDateTime(const std::string& prompt) {
        std::string dateTimeStr;
        bool validFormat = false;
        
        while (!validFormat) {
            dateTimeStr = getInput(prompt + " (YYYY-MM-DD HH:MM): ");
            
            // Simple format validation
            if (dateTimeStr.length() == 16 && 
                dateTimeStr[4] == '-' && dateTimeStr[7] == '-' && 
                dateTimeStr[10] == ' ' && dateTimeStr[13] == ':') {
                validFormat = true;
            } else {
                std::cout << "Invalid format. Please use YYYY-MM-DD HH:MM format." << std::endl;
            }
        }
        
        return dateTimeStr;
    }

    // Get item details based on category
    std::map<std::string, std::string> getItemDetails(ItemCategory category) {
        std::map<std::string, std::string> details;
        std::cout << "\nPlease provide details about the " << categoryNames[category] << ":" << std::endl;
        
        for (const auto& attribute : categoryAttributes[category]) {
            // Format attribute name for display (replace underscores with spaces)
            std::string displayName = attribute;
            std::replace(displayName.begin(), displayName.end(), '_', ' ');
            
            // Capitalize first letter
            if (!displayName.empty()) {
                displayName[0] = std::toupper(displayName[0]);
            }
            
            std::string value = getInput(displayName + ": ");
            details[attribute] = value;
        }
        
        return details;
    }

    // Generate a random ID
    std::string generateId() {
        const std::string chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        std::random_device rd;
        std::mt19937 generator(rd());
        std::uniform_int_distribution<> distribution(0, chars.size() - 1);
        
        std::string id;
        for (int i = 0; i < 10; ++i) {
            id += chars[distribution(generator)];
        }
        
        return id;
    }

    // Get current timestamp as string
    std::string getCurrentTimestamp() {
        auto now = std::chrono::system_clock::now();
        auto now_c = std::chrono::system_clock::to_time_t(now);
        
        std::stringstream ss;
        ss << std::put_time(std::localtime(&now_c), "%Y-%m-%d %H:%M:%S");
        return ss.str();
    }

    // Load predefined locations from JSON file
    void loadLocations() {
        predefinedLocations.clear();
        
        std::ifstream file(LOCATIONS_FILE);
        if (!file.is_open()) {
            std::cerr << "Failed to open locations file: " << LOCATIONS_FILE << std::endl;
            return;
        }
        
        std::string line;
        std::string content;
        
        while (std::getline(file, line)) {
            content += line;
        }
        
        file.close();
        
        // Simple JSON parsing
        if (content.empty() || content == "[]") {
            return;
        }
        
        // Strip outer brackets
        content = content.substr(1, content.length() - 2);
        
        // Split by location
        std::vector<std::string> locationStrings;
        int braceDepth = 0;
        std::string currentLocation;
        
        for (char c : content) {
            if (c == '{') {
                braceDepth++;
                currentLocation += c;
            } else if (c == '}') {
                braceDepth--;
                currentLocation += c;
                
                if (braceDepth == 0) {
                    locationStrings.push_back(currentLocation);
                    currentLocation = "";
                    // Skip comma and space after item
                    braceDepth = -1;
                }
            } else if (braceDepth == -1) {
                if (c == ',') {
                    braceDepth = 0;
                }
            } else {
                currentLocation += c;
            }
        }
        
        // Parse each location
        for (const auto& locStr : locationStrings) {
            Location loc;
            loc.name = extractJsonValue(locStr, "name");
            loc.roomNumber = extractJsonValue(locStr, "roomNumber");
            loc.description = extractJsonValue(locStr, "description");
            predefinedLocations.push_back(loc);
        }
    }
    
    // Get location from user with predefined options
    std::string getLocation() {
        std::cout << "\nSelect location:" << std::endl;
        std::cout << "1. Choose from predefined locations" << std::endl;
        std::cout << "2. Enter custom location" << std::endl;
        
        int choice = getIntInput("Enter your choice: ", 1, 2);
        
        if (choice == 1) {
            if (predefinedLocations.empty()) {
                std::cout << "No predefined locations available. Please enter a custom location." << std::endl;
                return getInput("Enter location: ");
            }
            
            std::cout << "\nAvailable locations:" << std::endl;
            for (size_t i = 0; i < predefinedLocations.size(); i++) {
                std::cout << (i + 1) << ". " << predefinedLocations[i].name;
                if (!predefinedLocations[i].roomNumber.empty()) {
                    std::cout << " (Room " << predefinedLocations[i].roomNumber << ")";
                }
                std::cout << std::endl;
            }
            
            int locChoice = getIntInput("Select location: ", 1, predefinedLocations.size());
            const Location& selectedLoc = predefinedLocations[locChoice - 1];
            
            std::string locationStr = selectedLoc.name;
            if (!selectedLoc.roomNumber.empty()) {
                locationStr += " (Room " + selectedLoc.roomNumber + ")";
            }
            
            return locationStr;
        } else {
            return getInput("Enter location: ");
        }
    }

    // Initialize data directory and files
    void initDataStorage() {
        try {
            // Create data directory if it doesn't exist
            if (!std::filesystem::exists(DATA_DIR)) {
                std::filesystem::create_directory(DATA_DIR);
            }
            
            // Create files if they don't exist
            if (!std::filesystem::exists(LOST_ITEMS_FILE)) {
                std::ofstream file(LOST_ITEMS_FILE);
                file << "[]";
                file.close();
            }
            
            if (!std::filesystem::exists(FOUND_ITEMS_FILE)) {
                std::ofstream file(FOUND_ITEMS_FILE);
                file << "[]";
                file.close();
            }
            
            if (!std::filesystem::exists(LOCATIONS_FILE)) {
                std::ofstream file(LOCATIONS_FILE);
                file << "[]";
                file.close();
            }
            
            // Load existing data
            loadItems();
            loadLocations();
        } catch (const std::exception& e) {
            std::cerr << "Error initializing data storage: " << e.what() << std::endl;
        }
    }

    // Load items from storage files
    void loadItems() {
        lostItems.clear();
        foundItems.clear();
        
        loadItemsFromFile(LOST_ITEMS_FILE, lostItems);
        loadItemsFromFile(FOUND_ITEMS_FILE, foundItems);
    }

    // Load items from a specific file
    void loadItemsFromFile(const std::string& filename, std::vector<Item>& items) {
        std::ifstream file(filename);
        if (!file.is_open()) {
            std::cerr << "Failed to open file: " << filename << std::endl;
            return;
        }
        
        std::string line;
        std::string content;
        
        while (std::getline(file, line)) {
            content += line;
        }
        
        file.close();
        
        // Simple JSON parsing (in a real application, use a proper JSON library)
        if (content.empty() || content == "[]") {
            return;
        }
        
        // Strip outer brackets
        content = content.substr(1, content.length() - 2);
        
        // Split by item
        std::vector<std::string> itemStrings;
        int braceDepth = 0;
        std::string currentItem;
        
        for (char c : content) {
            if (c == '{') {
                braceDepth++;
                currentItem += c;
            } else if (c == '}') {
                braceDepth--;
                currentItem += c;
                
                if (braceDepth == 0) {
                    itemStrings.push_back(currentItem);
                    currentItem = "";
                    // Skip comma and space after item
                    braceDepth = -1;
                }
            } else if (braceDepth == -1) {
                if (c == ',') {
                    braceDepth = 0;
                }
            } else {
                currentItem += c;
            }
        }
        
        // Parse each item
        for (const auto& itemStr : itemStrings) {
            Item item = parseItemJson(itemStr);
            items.push_back(item);
        }
    }

    // Parse a JSON string into an Item (simplified parser)
    Item parseItemJson(const std::string& json) {
        Item item;
        
        // Parse fields from JSON
        item.id = extractJsonValue(json, "id");
        item.personName = extractJsonValue(json, "personName");
        item.contactInfo = extractJsonValue(json, "contactInfo");
        item.category = extractJsonValue(json, "category");
        item.eventTime = extractJsonValue(json, "eventTime");
        item.location = extractJsonValue(json, "location");
        item.reportTime = extractJsonValue(json, "reportTime");
        item.additionalInfo = extractJsonValue(json, "additionalInfo");
        item.status = extractJsonValue(json, "status");
        
        // Parse details map
        std::string detailsJson = extractJsonObject(json, "details");
        if (!detailsJson.empty() && detailsJson != "{}") {
            detailsJson = detailsJson.substr(1, detailsJson.length() - 2); // Remove brackets
            
            // Split by fields
            std::vector<std::string> fields;
            int quoteDepth = 0;
            std::string currentField;
            
            for (size_t i = 0; i < detailsJson.length(); i++) {
                char c = detailsJson[i];
                
                if (c == '"') {
                    quoteDepth = (quoteDepth + 1) % 2;
                    currentField += c;
                } else if (c == ',' && quoteDepth == 0) {
                    fields.push_back(currentField);
                    currentField = "";
                } else {
                    currentField += c;
                }
            }
            
            if (!currentField.empty()) {
                fields.push_back(currentField);
            }
            
            // Parse each key-value pair
            for (const auto& field : fields) {
                size_t colonPos = field.find(':');
                if (colonPos != std::string::npos) {
                    std::string key = field.substr(0, colonPos);
                    std::string value = field.substr(colonPos + 1);
                    
                    // Clean up key and value
                    key = key.substr(key.find('"') + 1);
                    key = key.substr(0, key.rfind('"'));
                    
                    value = value.substr(value.find('"') + 1);
                    value = value.substr(0, value.rfind('"'));
                    
                    item.details[key] = value;
                }
            }
        }
        
        return item;
    }

    // Extract value for a specific key from JSON
    std::string extractJsonValue(const std::string& json, const std::string& key) {
        std::string keySearch = "\"" + key + "\":\"";
        size_t pos = json.find(keySearch);
        
        if (pos != std::string::npos) {
            pos += keySearch.length();
            size_t endPos = json.find("\"", pos);
            
            if (endPos != std::string::npos) {
                return json.substr(pos, endPos - pos);
            }
        }
        
        return "";
    }

    // Extract a JSON object for a specific key
    std::string extractJsonObject(const std::string& json, const std::string& key) {
        std::string keySearch = "\"" + key + "\":";
        size_t pos = json.find(keySearch);
        
        if (pos != std::string::npos) {
            pos += keySearch.length();
            size_t startPos = json.find("{", pos);
            
            if (startPos != std::string::npos) {
                int braceDepth = 1;
                size_t endPos = startPos + 1;
                
                while (braceDepth > 0 && endPos < json.length()) {
                    if (json[endPos] == '{') {
                        braceDepth++;
                    } else if (json[endPos] == '}') {
                        braceDepth--;
                    }
                    
                    endPos++;
                }
                
                if (braceDepth == 0) {
                    return json.substr(startPos, endPos - startPos);
                }
            }
        }
        
        return "{}";
    }

    // Convert item to JSON string
    std::string itemToJson(const Item& item) {
        std::stringstream json;
        
        json << "{";
        json << "\"id\":\"" << item.id << "\",";
        json << "\"personName\":\"" << escapeJsonString(item.personName) << "\",";
        json << "\"contactInfo\":\"" << escapeJsonString(item.contactInfo) << "\",";
        json << "\"category\":\"" << escapeJsonString(item.category) << "\",";
        json << "\"eventTime\":\"" << escapeJsonString(item.eventTime) << "\",";
        json << "\"location\":\"" << escapeJsonString(item.location) << "\",";
        json << "\"reportTime\":\"" << escapeJsonString(item.reportTime) << "\",";
        
        // Convert details map to JSON
        json << "\"details\":{";
        bool first = true;
        for (const auto& detail : item.details) {
            if (!first) {
                json << ",";
            }
            json << "\"" << escapeJsonString(detail.first) << "\":\"" 
                 << escapeJsonString(detail.second) << "\"";
            first = false;
        }
        json << "},";
        
        json << "\"additionalInfo\":\"" << escapeJsonString(item.additionalInfo) << "\",";
        json << "\"status\":\"" << escapeJsonString(item.status) << "\"";
        json << "}";
        
        return json.str();
    }

    // Escape special characters in JSON string
    std::string escapeJsonString(const std::string& input) {
        std::string output;
        
        for (char c : input) {
            switch (c) {
                case '\"': output += "\\\""; break;
                case '\\': output += "\\\\"; break;
                case '\b': output += "\\b"; break;
                case '\f': output += "\\f"; break;
                case '\n': output += "\\n"; break;
                case '\r': output += "\\r"; break;
                case '\t': output += "\\t"; break;
                default:
                    if (static_cast<unsigned char>(c) < 32) {
                        // Control characters
                        char buf[8];
                        sprintf(buf, "\\u%04x", c);
                        output += buf;
                    } else {
                        output += c;
                    }
            }
        }
        
        return output;
    }

    // Save items to files
    void saveItems() {
        saveItemsToFile(LOST_ITEMS_FILE, lostItems);
        saveItemsToFile(FOUND_ITEMS_FILE, foundItems);
    }

    // Save items to a specific file
    void saveItemsToFile(const std::string& filename, const std::vector<Item>& items) {
        std::ofstream file(filename);
        if (!file.is_open()) {
            std::cerr << "Failed to open file for writing: " << filename << std::endl;
            return;
        }
        
        file << "[";
        
        for (size_t i = 0; i < items.size(); i++) {
            if (i > 0) {
                file << ",";
            }
            file << itemToJson(items[i]);
        }
        
        file << "]";
        file.close();
    }

    // Save a lost item
    void saveLostItem(
        const std::string& reporterName,
        const std::string& contactInfo,
        ItemCategory category,
        const std::string& lostTime,
        const std::string& location,
        const std::map<std::string, std::string>& itemDetails,
        const std::string& additionalDetails
    ) {
        Item item;
        item.id = generateId();
        item.personName = reporterName;
        item.contactInfo = contactInfo;
        item.category = categoryNames[category];
        item.eventTime = lostTime;
        item.location = location;
        item.details = itemDetails;
        item.additionalInfo = additionalDetails;
        item.reportTime = getCurrentTimestamp();
        item.status = "OPEN";
        
        lostItems.push_back(item);
        saveItems();
    }

    // Save a found item
    void saveFoundItem(
        const std::string& finderName,
        const std::string& contactInfo,
        ItemCategory category,
        const std::string& foundTime,
        const std::string& location,
        const std::map<std::string, std::string>& itemDetails,
        const std::string& additionalDetails
    ) {
        Item item;
        item.id = generateId();
        item.personName = finderName;
        item.contactInfo = contactInfo;
        item.category = categoryNames[category];
        item.eventTime = foundTime;
        item.location = location;
        item.details = itemDetails;
        item.additionalInfo = additionalDetails;
        item.reportTime = getCurrentTimestamp();
        item.status = "OPEN";
        
        foundItems.push_back(item);
        saveItems();
    }

    // Calculate match score between two items (simple matching algorithm)
    int calculateMatchScore(const Item& item1, const Item& item2) {
        if (item1.category != item2.category) {
            return 0;  // Different categories, no match
        }
        
        int score = 0;
        
        // Compare details
        for (const auto& detail1 : item1.details) {
            auto it = item2.details.find(detail1.first);
            if (it != item2.details.end()) {
                // Found matching attribute, check value
                std::string value1 = detail1.second;
                std::string value2 = it->second;
                
                // Convert to lowercase for comparison
                std::transform(value1.begin(), value1.end(), value1.begin(), ::tolower);
                std::transform(value2.begin(), value2.end(), value2.begin(), ::tolower);
                
                if (value1 == value2) {
                    score += 10;  // Exact match
                } else if (value1.find(value2) != std::string::npos || 
                           value2.find(value1) != std::string::npos) {
                    score += 5;   // Partial match
                }
            }
        }
        
        // Check location for similarity
        std::string loc1 = item1.location;
        std::string loc2 = item2.location;
        std::transform(loc1.begin(), loc1.end(), loc1.begin(), ::tolower);
        std::transform(loc2.begin(), loc2.end(), loc2.begin(), ::tolower);
        
        if (loc1 == loc2) {
            score += 10;  // Same location
        } else if (loc1.find(loc2) != std::string::npos || 
                   loc2.find(loc1) != std::string::npos) {
            score += 5;   // Similar location
        }
        
        return score;
    }

    // Search for matching items
    void searchForMatches(bool isLostItem, const std::string& category, const std::map<std::string, std::string>& searchDetails) {
        const std::vector<Item>& searchIn = isLostItem ? foundItems : lostItems;
        
        // Create temporary item for comparison
        Item searchItem;
        searchItem.category = category;
        searchItem.details = searchDetails;
        
        // Find potential matches
        std::vector<std::pair<Item, int>> matches;  // Item and match score
        
        for (const auto& item : searchIn) {
            if (item.category == category && item.status == "OPEN") {
                int score = calculateMatchScore(searchItem, item);
                if (score > 0) {
                    matches.push_back({item, score});
                }
            }
        }
        
        // Sort by score (highest first)
        std::sort(matches.begin(), matches.end(), 
                 [](const auto& a, const auto& b) { return a.second > b.second; });
        
        // Display matches
        std::cout << "\nPotential matches found: " << matches.size() << std::endl;
        
        for (size_t i = 0; i < matches.size(); i++) {
            const auto& match = matches[i];
            std::cout << "\nMatch #" << (i + 1) << " (Score: " << match.second << "):" << std::endl;
            std::cout << "Category: " << match.first.category << std::endl;
            std::cout << "Location: " << match.first.location << std::endl;
            std::cout << (isLostItem ? "Found" : "Lost") << " Time: " << match.first.eventTime << std::endl;
            
            std::cout << "Details:" << std::endl;
            for (const auto& detail : match.first.details) {
                std::string displayName = detail.first;
                std::replace(displayName.begin(), displayName.end(), '_', ' ');
                if (!displayName.empty()) {
                    displayName[0] = std::toupper(displayName[0]);
                }
                std::cout << "  " << displayName << ": " << detail.second << std::endl;
            }
            
            std::cout << "Additional Info: " << match.first.additionalInfo << std::endl;
            
            // Ask if user wants to contact the person
            if (i < matches.size() - 1) {
                std::cout << "\nPress Enter to see next match or 'C' to contact this person: ";
            } else {
                std::cout << "\nPress 'C' to contact this person or any other key to return: ";
            }
            
            std::string response;
            std::getline(std::cin, response);
            
            if (response == "C" || response == "c") {
                std::cout << "\nContact Information:" << std::endl;
                std::cout << "Name: " << match.first.personName << std::endl;
                std::cout << "Contact: " << match.first.contactInfo << std::endl;
                
                std::cout << "\nPress Enter to continue...";
                std::getline(std::cin, response);
                break;
            }
        }
        
        if (matches.empty()) {
            std::cout << "No potential matches found." << std::endl;
        }
    }

public:
    // Constructor
    LostFoundBot() {
        initCategoryAttributes();
        initDataStorage();
    }
    
    // Start the bot and display the main menu
    void start() {
        bool running = true;
        
        while (running) {
            std::cout << "\n===== LOST & FOUND BOT =====\n"
                      << "1. Report a lost item\n"
                      << "2. Report a found item\n"
                      << "3. Search for items\n"
                      << "4. Exit\n"
                      << "Enter your choice: ";
            
            int choice = getIntInput("", 1, 4);
            
            switch (choice) {
                case 1:
                    reportLostItem();
                    break;
                case 2:
                    reportFoundItem();
                    break;
                case 3:
                    searchItems();
                    break;
                case 4:
                    running = false;
                    std::cout << "Thank you for using Lost & Found Bot. Goodbye!" << std::endl;
                    break;
            }
        }
    }
    
    // Report a lost item
    void reportLostItem() {
        std::cout << "\n===== REPORT A LOST ITEM =====" << std::endl;
        
        // Get user information
        std::string reporterName = getInput("Enter your name: ");
        std::string contactInfo = getInput("Enter your contact (phone/email): ");
        
        // Get item category
        ItemCategory category = getItemCategory();
        
        // Get when the item was lost
        std::string lostTime = getDateTime("When did you lose the item?");
        
        // Get location where item was lost
        std::string location = getLocation();
        
        // Get item details based on category
        std::map<std::string, std::string> itemDetails = getItemDetails(category);
        
        // Get additional description
        std::string additionalDetails = getInput("Please provide any additional details about the item: ");
        
        // Save to storage
        saveLostItem(reporterName, contactInfo, category, lostTime, location, 
                     itemDetails, additionalDetails);
        
        std::cout << "Lost item report submitted successfully!" << std::endl;
        
        // Check for potential matches
        searchForMatches(true, categoryNames[category], itemDetails);
    }
    
    // Report a found item
    void reportFoundItem() {
        std::cout << "\n===== REPORT A FOUND ITEM =====" << std::endl;
        
        // Get finder information
        std::string finderName = getInput("Enter your name: ");
        std::string contactInfo = getInput("Enter your contact (phone/email): ");
        
        // Get item category
        ItemCategory category = getItemCategory();
        
        // Get when the item was found
        std::string foundTime = getDateTime("When did you find the item?");
        
        // Get location where item was found
        std::string location = getLocation();
        
        // Get item details based on category
        std::map<std::string, std::string> itemDetails = getItemDetails(category);
        
        // Get additional description
        std::string additionalDetails = getInput("Please provide any additional details about the item: ");
        
        // Save to storage
        saveFoundItem(finderName, contactInfo, category, foundTime, location, 
                      itemDetails, additionalDetails);
        
        std::cout << "Found item report submitted successfully!" << std::endl;
        
        // Check for potential matches
        searchForMatches(false, categoryNames[category], itemDetails);
    }
    
    // Search for items
    void searchItems() {
        std::cout << "\n===== SEARCH FOR ITEMS =====" << std::endl;
        std::cout << "1. Search for lost items\n"
                  << "2. Search for found items\n"
                  << "3. Back to main menu" << std::endl;
        
        int choice = getIntInput("Enter your choice: ", 1, 3);
        
        if (choice == 3) {
            return;
        }
        
        bool searchingLost = (choice == 2); // If looking for found items, we search lost items
        
        // Get search criteria
        ItemCategory category = getItemCategory();
        
        // Get item details based on category for searching
        std::map<std::string, std::string> searchDetails = getItemDetails(category);
        
        // Search for potential matches
        searchForMatches(searchingLost, categoryNames[category], searchDetails);
    }
};

int main() {
    std::cout << "Initializing Lost & Found Bot..." << std::endl;
    
    LostFoundBot bot;
    bot.start();
    
    return 0;
}
