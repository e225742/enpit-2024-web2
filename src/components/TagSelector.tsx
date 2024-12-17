import React, { useState, useEffect } from "react";

type Tag = {
  id: number;
  name: string;
};

type TagSelectorProps = {
  selectedTags: Tag[];
  setSelectedTags: (tags: Tag[]) => void;
  isProcessing: boolean;
  setIsProcessing?: (processing: boolean) => void; // setIsProcessing を追加
  allowTagCreation?: boolean; // タグ作成を許可するオプション
};

const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  setSelectedTags,
  isProcessing,
  setIsProcessing = () => {}, // デフォルトで空の関数を設定
  allowTagCreation = true,
}) => {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [query, setQuery] = useState("");
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [confirmCreate, setConfirmCreate] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      const response = await fetch("/api/get-tags");
      if (response.ok) {
        const tags = await response.json();
        setAllTags(tags);
      }
    };
    fetchTags();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setFilteredTags([]);
      setConfirmCreate(false);
    } else {
      setFilteredTags(
        allTags.filter(
          (tag) => tag.name.includes(query) && !selectedTags.some((t) => t.id === tag.id)
        )
      );
    }
  }, [query, allTags, selectedTags]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (isProcessing) return;
      if (!query.trim()) return;

      const existingTag = allTags.find((tag) => tag.name === query.trim());

      if (existingTag) {
        setSelectedTags([...selectedTags, existingTag]);
        setQuery("");
      } else if (allowTagCreation && !confirmCreate) {
        setConfirmCreate(true);
      } else if (allowTagCreation) {
        createTag(query.trim());
      }
    }
  };

  const createTag = async (name: string) => {
    if (isProcessing) return;

    setIsProcessing(true); // タグ作成中を設定
    try {
      const response = await fetch("/api/create-tag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        const newTag: Tag = await response.json();
        setAllTags([...allTags, newTag]);
        setSelectedTags([...selectedTags, newTag]);
        setQuery("");
      } else {
        console.error("Failed to create tag");
      }
    } catch (error) {
      console.error("Error creating tag:", error);
    } finally {
      setIsProcessing(false); // タグ作成処理終了
    }
  };

  const handleRemoveTag = (tagId: number) => {
    if (isProcessing) return;
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId));
  };

  return (
    <div>
      <div>
        {selectedTags.map((tag) => (
          <span
            key={tag.id}
            style={{
              margin: "0 5px",
              padding: "5px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          >
            {tag.name}{" "}
            <button onClick={() => handleRemoveTag(tag.id)} disabled={isProcessing}>
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="タグを選択してください"
        disabled={isProcessing}
        style={{ width: "100%", padding: "8px", marginTop: "5px", marginBottom: "10px", border: "solid 0.5px" }}
      />
      {confirmCreate && allowTagCreation && (
        <div style={{ color: "red", marginTop: "5px" }}>
          「{query}」を新しいタグとして作成しますか？もう一度エンターを押してください。
        </div>
      )}
      {filteredTags.length > 0 && (
        <div
          style={{
            border: "1px solid #ccc",
            marginTop: "5px",
            borderRadius: "4px",
            maxHeight: "100px",
            overflowY: "auto",
          }}
        >
          {filteredTags.map((tag) => (
            <div
              key={tag.id}
              onClick={() => setSelectedTags([...selectedTags, tag])}
              style={{ padding: "8px", cursor: "pointer" }}
            >
              {tag.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagSelector;
