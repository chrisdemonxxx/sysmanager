import React, { useEffect, useState } from 'react';

const AvatarUploader: React.FC = () => {
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    setAvatar(localStorage.getItem('avatar'));
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result as string;
      localStorage.setItem('avatar', data);
      setAvatar(data);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {avatar && (
        <img src={avatar} alt="avatar" className="w-24 h-24 rounded-full" />
      )}
      <input type="file" accept="image/*" onChange={onChange} />
    </div>
  );
};

export default AvatarUploader;
