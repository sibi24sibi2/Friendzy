
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage();

export const uploadImage = async (file) => {
    const storageRefForImage = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRefForImage, file);
    const downloadURL = await getDownloadURL(storageRefForImage);

    return downloadURL;
};

export const uploadProfile = async (file) => {
    const storageRefForProfile = ref(storage, `profile/${file.name}`);
    await uploadBytes(storageRefForProfile, file);
    const profilePicURL = await getDownloadURL(storageRefForProfile);

    return profilePicURL;
};
