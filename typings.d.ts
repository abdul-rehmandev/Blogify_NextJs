interface PostTypes {
    id: string;
    title: string;
    content: string;
    imageUrl?: null | string;
    publicId?: string;
    catName?: string;
    links?: null | string[];
    createdAt: string;
    updatedAt: string;
    authorEmail: string;
    author: {
        name: string;
    }
}


interface CategoryTypes {
    id: string;
    catName: string;
}