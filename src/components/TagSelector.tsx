import React, { useState, useEffect } from 'react';

type Tag = {
  id: number;
  name: string;
};

const TagSelector = ({ selectedTags, setSelectedTags }: { selectedTags: Tag[]; setSelectedTags: (tags: Tag[]) => void }) => {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [query, setQuery] = useState('');
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);

  // タグ一覧を取得する
  useEffect(() => {
    const fetchTags = async () => {
      const response = await fetch('/api/get-tags');
      if (response.ok) {
        const tags = await response.json();
        setAllTags(tags);
      }
    };
    fetchTags();
  }, []);

  // 入力に基づいてタグ候補をフィルタリング
  useEffect(() => {
    if (query === '') {
      setFilteredTags([]);
    } else {
      setFilteredTags(allTags.filter(tag => tag.name.includes(query) && !selectedTags.some(t => t.id === tag.id)));
    }
  }, [query, allTags, selectedTags]);

  // タグを選択したときの処理
  const handleSelectTag = (tag: Tag) => {
    setSelectedTags([...selectedTags, tag]);
    setQuery(''); // 入力フィールドをクリア
  };

  // 選択したタグを削除する
  const handleRemoveTag = (tagId: number) => {
    setSelectedTags(selectedTags.filter(tag => tag.id !== tagId));
  };

  return (
    <div>
      <div>
        {selectedTags.map(tag => (
          <span key={tag.id} style={{ margin: '0 5px', padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}>
            {tag.name} <button onClick={() => handleRemoveTag(tag.id)}>×</button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="タグを選択するか作成"
        style={{ width: '100%', padding: '8px', marginTop: '10px' }}
      />
      {filteredTags.length > 0 && (
        <div style={{ border: '1px solid #ccc', marginTop: '5px', borderRadius: '4px', maxHeight: '100px', overflowY: 'auto' }}>
          {filteredTags.map(tag => (
            <div
              key={tag.id}
              onClick={() => handleSelectTag(tag)}
              style={{ padding: '8px', cursor: 'pointer' }}
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
