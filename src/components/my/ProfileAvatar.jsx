import { User } from "lucide-react";
import PhotoUploader from "../common/PhotoUploader";

export default function ProfileAvatar({ previewUrl, isEditing, onDrop }) {
  return (
    <div className="relative group">
      <div
        className={`w-32 h-32 rounded-[2.8rem] overflow-hidden border-4 ${
          isEditing
            ? "border-blue-100 ring-4 ring-blue-50"
            : "border-white shadow-md"
        } transition-all duration-500`}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="profile" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
            <User size={40} strokeWidth={1.5} />
          </div>
        )}
      </div>

      {isEditing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-[2.8rem] backdrop-blur-[2px] animate-in fade-in">
          <PhotoUploader
            type="profile"
            previews={previewUrl ? [previewUrl] : []}
            onDrop={onDrop}
          />
        </div>
      )}
    </div>
  );
}
