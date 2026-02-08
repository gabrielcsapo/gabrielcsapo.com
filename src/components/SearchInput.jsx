import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import MiniSearch from "minisearch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

let miniSearch;

function transformItems(items) {
  const pagesMap = new Map();

  items.forEach((item) => {
    const [mainPageLink, section] = item.link.split("#");

    if (section === undefined) {
      pagesMap.set(mainPageLink, {
        title: item.title,
        link: mainPageLink,
        sections: [],
      });
    }
  });

  items.forEach((item) => {
    const [mainPageLink, section] = item.link.split("#");

    if (section !== undefined) {
      const mainPage = pagesMap.get(mainPageLink);
      if (mainPage) {
        mainPage.sections.push({
          title: item.sectionTitle,
          link: item.link,
        });
      }
    }
  });

  return Array.from(pagesMap.values());
}

const SearchInput = () => {
  const [input, setInput] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const loadSearchIndex = async () => {
    if (!miniSearch) {
      const searchIndex = await import("virtual:search");
      miniSearch = MiniSearch.loadJS(searchIndex.default, {
        fields: ["title", "text"],
        storeFields: ["title", "sectionTitle", "link"],
      });
    }
  };

  const allLinks = searchResults.flatMap((result) =>
    result.sections.length > 0 ? result.sections.map((s) => s.link) : [result.link],
  );

  const openModal = useCallback(() => {
    setModalOpen(true);
    setInput("");
    setSearchResults([]);
    setSelectedIndex(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setInput("");
    setSearchResults([]);
    setSelectedIndex(0);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openModal();
      }
      if (e.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, openModal, closeModal]);

  const handleNavigate = useCallback(
    (link) => {
      closeModal();
      navigate(link);
    },
    [closeModal, navigate],
  );

  const handleModalKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, allLinks.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && allLinks[selectedIndex]) {
      e.preventDefault();
      handleNavigate(allLinks[selectedIndex]);
    }
  };

  const onSearch = async (e) => {
    const value = e.target.value;
    setInput(value);
    setSelectedIndex(0);

    if (!value) {
      setSearchResults([]);
      return;
    }

    await loadSearchIndex();

    const results = miniSearch.search(value);
    setSearchResults(transformItems(results));
  };

  let linkIndex = 0;

  return (
    <>
      <button
        onClick={openModal}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-surface-400 bg-surface-100 dark:bg-surface-800 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors cursor-pointer"
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} className="w-3 h-3" />
        <span className="hidden lg:inline">Search</span>
        <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-surface-200 dark:bg-surface-700 rounded text-surface-500 dark:text-surface-400">
          <span>&#8984;</span>K
        </kbd>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
          <div
            className="relative w-full max-w-lg mx-4 bg-white dark:bg-surface-900 rounded-xl shadow-2xl border border-surface-200 dark:border-surface-700 overflow-hidden"
            onKeyDown={handleModalKeyDown}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-200 dark:border-surface-700">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="w-4 h-4 text-surface-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search posts..."
                value={input}
                onChange={onSearch}
                className="flex-1 bg-transparent text-surface-900 dark:text-white placeholder-surface-400 outline-none text-base"
              />
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-surface-100 dark:bg-surface-800 rounded text-surface-500 dark:text-surface-400">
                ESC
              </kbd>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {!input && (
                <div className="px-4 py-8 text-center text-sm text-surface-400">
                  Type to search posts...
                </div>
              )}

              {input && searchResults.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-surface-400">
                  No posts found for &ldquo;{input}&rdquo;
                </div>
              )}

              {searchResults
                .filter((result) => result.sections && result.sections.length > 0)
                .map(({ title, link, sections }) => (
                  <div key={link} className="py-2">
                    <div className="px-4 py-1 text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                      {title}
                    </div>
                    {sections.map((section) => {
                      const currentLinkIndex = linkIndex++;
                      const isSelected = currentLinkIndex === selectedIndex;
                      return (
                        <button
                          key={section.link}
                          onClick={() => handleNavigate(section.link)}
                          className={`w-full text-left px-4 py-2 flex items-center gap-3 text-sm transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                              : "text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800"
                          }`}
                        >
                          <span className="text-surface-400">#</span>
                          <span className="truncate">{section.title}</span>
                        </button>
                      );
                    })}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchInput;
