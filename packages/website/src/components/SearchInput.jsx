import React, { useEffect, useRef, useState } from "react";

import MiniSearch from "minisearch";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./SearchInput.module.css";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

let miniSearch;

const MarkedText = ({ text }) => {
  const markedText = text?.replace(
    /<mark>(.*?)<\/mark>/g,
    `<span class="${styles.marked}">$1</span>`,
  );

  return <div dangerouslySetInnerHTML={{ __html: markedText }} />;
};

function transformItems(items) {
  const pagesMap = new Map();

  items.forEach((item) => {
    const [mainPageLink, section] = item.link.split("#");

    // Check if the item is a main page
    if (section === undefined) {
      pagesMap.set(mainPageLink, {
        title: item.title,
        link: mainPageLink,
        sections: [],
      });
    }
  });

  // Add sections to the main pages
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
  const inputRef = useRef(null);

  const loadSearchIndex = async () => {
    if (!miniSearch) {
      const searchIndex = await import("virtual:search");
      miniSearch = MiniSearch.loadJS(searchIndex.default, {
        fields: ["title", "text"],
        storeFields: ["title", "sectionTitle", "link"],
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        setModalOpen(true);
        setTimeout(() => {
          inputRef.current.focus();
        }, 100);
      }
      if (e.key === "Escape") {
        setModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const onSearch = async (e) => {
    await loadSearchIndex();

    setInput(e.target.value);

    const searchResults = miniSearch.search(e.target.value);

    setSearchResults(transformItems(searchResults));
  };

  return (
    <>
      <div className={styles.container} onClick={handleModalOpen}>
        <span className={styles.icon}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </span>
        <span className={styles.placeholderText}>Search</span>
        <span className={styles.shortcut}>
          <span className={styles.key}>⌘</span>
          <span className={styles.key}>K</span>
        </span>
      </div>

      {isModalOpen && (
        <>
          <div
            className={styles.modalBackdrop}
            onClick={handleModalClose}
          ></div>
          <div className={styles.modal}>
            <div className={styles.searchInputContainer}>
              <span className={styles.icon}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </span>
              <input
                className={styles.input}
                ref={inputRef}
                type="text"
                placeholder="Search..."
                onChange={onSearch}
                style={{ width: "100%" }}
              />
            </div>
            {!input && (
              <div className={styles.emptyText}>
                Please provide a search query to show results.
              </div>
            )}

            {input && searchResults.length === 0 && (
              <div className={styles.emptyText}>
                No search results found for "{input}"
              </div>
            )}
            <ul className={styles.searchResultsList}>
              {searchResults
                .filter(
                  (result) => result.sections && result.sections.length > 0,
                )
                .map(({ title, link, sections }) => {
                  return (
                    <section key={link}>
                      <small>
                        <a className={styles.searchResultItemTitle} href={link}>
                          {title}
                        </a>
                      </small>
                      <ul className={styles.searchResultsList}>
                        {sections &&
                          sections?.map((section) => {
                            return (
                              <li
                                className={styles.searchResultItem}
                                key={section.link}
                              >
                                <a href={section.link}>{section.title}</a>
                                <small>{section.link}</small>
                              </li>
                            );
                          })}
                      </ul>
                    </section>
                  );
                })}
            </ul>
          </div>
        </>
      )}
    </>
  );
};

export default SearchInput;
