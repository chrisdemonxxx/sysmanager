import AvatarUploader from '../components/AvatarUploader';
import ThemeSelector from '../components/ThemeSelector';

export default function Settings() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">User Settings</h1>
      <AvatarUploader />
      <div>
        <h2 className="mb-2 font-medium">Theme</h2>
        <ThemeSelector />
      </div>
    </div>
  );
}
