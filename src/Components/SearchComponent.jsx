import { useState, useEffect, useRef } from "react";
import { Search, User, FileText, X } from "react-feather";
import { Link } from "react-router-dom";
import { searchUsers, searchPosts } from "../Api/CommanApi";

export default function SearchComponent({ className = "" }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [userResults, setUserResults] = useState([]);
    const [postResults, setPostResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);
    const suggestionsRef = useRef(null);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target) &&
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Debounced search
    useEffect(() => {
        if (!searchTerm.trim()) {
            setUserResults([]);
            setPostResults([]);
            setShowSuggestions(false);
            return;
        }

        const searchTimeout = setTimeout(async () => {
            setIsLoading(true);
            setShowSuggestions(true);

            try {
                // Search both users and posts in parallel
                const [users, posts] = await Promise.all([
                    searchUsers(searchTerm),
                    searchPosts(searchTerm),
                ]);

                setUserResults(users || []);
                setPostResults(posts || []);
            } catch (error) {
                console.error("Error searching: ", error);
                setUserResults([]);
                setPostResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(searchTimeout);
    }, [searchTerm]);

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleClear = () => {
        setSearchTerm("");
        setUserResults([]);
        setPostResults([]);
        setShowSuggestions(false);
    };

    const handleResultClick = () => {
        setShowSuggestions(false);
    };

    const hasResults = userResults.length > 0 || postResults.length > 0;
    const showDropdown = showSuggestions && searchTerm.trim().length > 0;

    return (
        <div className={`relative ${className}`} ref={searchRef}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="search"
                    placeholder="Search users and posts..."
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => {
                        if (searchTerm.trim() && (userResults.length > 0 || postResults.length > 0)) {
                            setShowSuggestions(true);
                        }
                    }}
                    className="w-full pl-10 pr-10 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchTerm && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Suggestions Dropdown */}
            {showDropdown && (
                <div
                    ref={suggestionsRef}
                    className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50"
                >
                    {isLoading ? (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                            Searching...
                        </div>
                    ) : !hasResults ? (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                            No results found
                        </div>
                    ) : (
                        <div className="py-2">
                            {/* Users Section */}
                            {userResults.length > 0 && (
                                <div className="mb-2">
                                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-200 dark:border-gray-700">
                                        Users
                                    </div>
                                    <div className="py-1">
                                        {userResults.map((user) => (
                                            <Link
                                                key={user.userID}
                                                to={`/profile/${user.userID}`}
                                                onClick={handleResultClick}
                                                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=random`}
                                                        alt={user.name}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                        {user.name}
                                                    </p>
                                                    {user.role && (
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                            {user.role}
                                                        </p>
                                                    )}
                                                </div>
                                                <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Posts Section */}
                            {postResults.length > 0 && (
                                <div>
                                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-gray-200 dark:border-gray-700">
                                        Posts
                                    </div>
                                    <div className="py-1">
                                        {postResults.map((post) => {
                                            const content = post.content || "";
                                            const searchLower = searchTerm.toLowerCase();
                                            const contentLower = content.toLowerCase();
                                            const index = contentLower.indexOf(searchLower);

                                            // Create highlighted content
                                            let highlightedContent = content;
                                            if (index !== -1 && searchTerm.trim()) {
                                                const beforeMatch = content.substring(0, index);
                                                const match = content.substring(index, index + searchTerm.length);
                                                const afterMatch = content.substring(index + searchTerm.length);
                                                highlightedContent = `${beforeMatch}<mark class="bg-yellow-200 dark:bg-yellow-900 px-0.5 rounded">${match}</mark>${afterMatch}`;
                                            }

                                            // Truncate for display (accounting for HTML tags)
                                            const maxLength = 150;
                                            let displayText = highlightedContent;
                                            if (content.length > maxLength) {
                                                // Find a good truncation point that includes the match
                                                if (index !== -1 && index < maxLength) {
                                                    // Show match with context
                                                    const start = Math.max(0, index - 30);
                                                    const end = Math.min(content.length, index + searchTerm.length + 70);
                                                    const truncated = content.substring(start, end);
                                                    if (start > 0) {
                                                        const truncatedHighlighted = truncated.replace(
                                                            new RegExp(searchTerm, 'gi'),
                                                            '<mark class="bg-yellow-200 dark:bg-yellow-900 px-0.5 rounded">$&</mark>'
                                                        );
                                                        displayText = `...${truncatedHighlighted}...`;
                                                    } else {
                                                        displayText = truncated.replace(
                                                            new RegExp(searchTerm, 'gi'),
                                                            '<mark class="bg-yellow-200 dark:bg-yellow-900 px-0.5 rounded">$&</mark>'
                                                        ) + '...';
                                                    }
                                                } else {
                                                    displayText = content.substring(0, maxLength) + '...';
                                                }
                                            }

                                            return (
                                                <Link
                                                    key={post.id}
                                                    to={`/home`}
                                                    onClick={handleResultClick}
                                                    className="flex items-start gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                                                >
                                                    <FileText className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                                    <div className="flex-1 min-w-0">
                                                        <p
                                                            className="text-sm text-gray-900 dark:text-white line-clamp-3"
                                                            dangerouslySetInnerHTML={{
                                                                __html: displayText,
                                                            }}
                                                        />
                                                        {post.imageUrl && (
                                                            <div className="mt-2">
                                                                <img
                                                                    src={post.imageUrl}
                                                                    alt="Post"
                                                                    className="w-16 h-16 rounded object-cover"
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

