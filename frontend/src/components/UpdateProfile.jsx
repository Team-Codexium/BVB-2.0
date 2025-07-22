import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const UpdateProfile = ({ user, onClose }) => {
    const [form, setForm] = useState({
        fullName: user.fullName || "",
        username: user.username || "",
        bio: user.bio || "",
    });
    const [saving, setSaving] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(user.image || "");
    const { updateUser, getCurrentUser, token } = useAuth()

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select a valid image file');
                return;
            }

            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB');
                return;
            }

            setImageFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview("");
        setForm(prev => ({ ...prev, image: "" }));
        // Reset the file input
        const fileInput = document.getElementById('image-upload');
        if (fileInput) fileInput.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            let updatedForm = { ...form };
            let formData = new FormData();
            formData.append('fullName', updatedForm.fullName);
            formData.append('username', updatedForm.username);
            formData.append('bio', updatedForm.bio);
            formData.append('image', imageFile);
            //   console.log("Form Data:", formData);

            if (imageFile) {
                updatedForm.image = imagePreview;
            }
            await updateUser(formData);
            // Refresh user data
            if (token) {
                await getCurrentUser();
            }
            onClose();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <Avatar className="w-24 h-24 border-2 border-yellow-400 shadow-lg">
                        <AvatarImage src={imagePreview || "/default-avatar.png"} />
                        <AvatarFallback className="text-lg">
                            {(form.username || form.fullName || "?")[0].toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    {imagePreview && (
                        <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                            onClick={removeImage}
                        >
                            <X className="w-3 h-3" />
                        </Button>
                    )}
                </div>

                <div className="flex flex-col items-center gap-2">
                    <Label
                        htmlFor="image-upload"
                        className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-800 border border-yellow-400 text-yellow-400 font-orbitron rounded-md hover:bg-gray-700 transition-colors"
                    >
                        <Upload className="w-4 h-4" />
                        Upload Photo
                    </Label>
                    <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                    <p className="text-xs text-gray-400 text-center">
                        Max 5MB • JPG, PNG, GIF
                    </p>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="fullName" className="text-yellow-400 font-orbitron">
                    Full Name
                </Label>
                <Input
                    id="fullName"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className="bg-gray-900 border-yellow-400 text-yellow-400 font-orbitron focus:border-yellow-300"
                    placeholder="Enter your full name"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="username" className="text-yellow-400 font-orbitron">
                    Username
                </Label>
                <Input
                    id="username"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="bg-gray-900 border-yellow-400 text-yellow-400 font-orbitron focus:border-yellow-300"
                    placeholder="Choose a username"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="bio" className="text-yellow-400 font-orbitron">
                    Bio
                </Label>
                <Input
                    id="bio"
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    className="bg-gray-900 border-yellow-400 text-yellow-400 font-orbitron focus:border-yellow-300"
                    placeholder="Tell us about yourself"
                />
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    className="font-orbitron border-yellow-400 text-yellow-400 hover:bg-gray-800"
                    onClick={onClose}
                    disabled={saving}
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    className="font-orbitron bg-yellow-400 text-black hover:bg-yellow-300 disabled:opacity-50"
                    disabled={saving}
                    onClick={handleSubmit}
                >
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
    );
};

export default UpdateProfile;