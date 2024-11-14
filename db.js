const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/book-management', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const bookSchema = new mongoose.Schema({
    id: String,
    name: String,
    desc: String,
    imgUrl: String,
    numb: Number,
    price: Number,
    publisher: String,
    yearPublication: Number,
    createdAt: Date,
    id_category: String,
    id_author: String,
    isEnable: Boolean
})

const Book = mongoose.model("Book", bookSchema)

const currentDate = new Date();

Book.create([
    {
        id: 'B001',
        name: 'The Great Gatsby',
        desc: 'A classic novel set in the 1920s.',
        imgUrl: 'https://upload.wikimedia.org/wikipedia/vi/2/26/TheGreatGatsby2012Poster.jpg',
        numb: 10,
        price: 20.99,
        publisher: 'Scribner',
        yearPublication: 1925,
        createdAt: currentDate,
        id_category: 'C001',
        id_author: 'A001',
        isEnable: true
    },
    {
        id: 'B002',
        name: 'To Kill a Mockingbird',
        desc: 'A story about racial injustice in the Deep South.',
        imgUrl: 'https://m.media-amazon.com/images/I/81aY1lxk+9L._SL1500_.jpg',
        numb: 8,
        price: 15.50,
        publisher: 'J.B. Lippincott & Co.',
        yearPublication: 1960,
        createdAt: currentDate,
        id_category: 'C001',
        id_author: 'A002',
        isEnable: true
    },
    {
        id: 'B003',
        name: '1984',
        desc: 'A dystopian novel depicting a totalitarian society.',
        imgUrl: 'https://thuviensach.vn/img/news/2022/09/larger/1011-1984-1.jpg?v=8882',
        numb: 15,
        price: 18.00,
        publisher: 'Secker & Warburg',
        yearPublication: 1949,
        createdAt: currentDate,
        id_category: 'C002',
        id_author: 'A003',
        isEnable: true
    },
    {
        id: 'B004',
        name: 'Moby Dick',
        desc: 'The epic tale of Captain Ahab\'s quest for revenge against the white whale.',
        imgUrl: 'https://upload.wikimedia.org/wikipedia/vi/8/85/Moby_Dick-C%C3%A1_voi_tr%E1%BA%AFng_%28s%C3%A1ch%29.jpg',
        numb: 5,
        price: 12.75,
        publisher: 'Harper & Brothers',
        yearPublication: 1851,
        createdAt: currentDate,
        id_category: 'C003',
        id_author: 'A003',
        isEnable: true
    },
    {
        id: 'B005',
        name: 'Pride and Prejudice',
        desc: 'A romantic novel about the manners and marriage of the British gentry.',
        imgUrl: 'https://m.media-amazon.com/images/M/MV5BMTA1NDQ3NTcyOTNeQTJeQWpwZ15BbWU3MDA0MzA4MzE@._V1_FMjpg_UX1000_.jpg',
        numb: 12,
        price: 14.99,
        publisher: 'T. Egerton',
        yearPublication: 1813,
        createdAt: currentDate,
        id_category: 'C002',
        id_author: 'A004',
        isEnable: true
    },
    {
        id: 'B006',
        name: 'The Catcher in the Rye',
        desc: 'A story that explores complex issues of identity and connection.',
        imgUrl: 'https://goldenglobes.com/wp-content/uploads/2023/10/pride-prejudice.jpg?w=600?w=600',
        numb: 7,
        price: 13.50,
        publisher: 'Little, Brown and Company',
        yearPublication: 1951,
        createdAt: currentDate,
        id_category: 'C003',
        id_author: 'A002',
        isEnable: true
    },
    {
        id: 'B007',
        name: 'War and Peace',
        desc: 'A detailed narrative that interweaves the stories of different families.',
        imgUrl: 'https://m.media-amazon.com/images/I/51fT63PZCPL._SY445_SX342_.jpg',
        numb: 4,
        price: 25.00,
        publisher: 'The Russian Messenger',
        yearPublication: 1869,
        createdAt: currentDate,
        id_category: 'C004',
        id_author: 'A005',
        isEnable: true
    },
    {
        id: 'B008',
        name: 'The Odyssey',
        desc: 'An ancient epic about the journey of Odysseus.',
        imgUrl: 'https://monsieurdidot.com/wp-content/uploads/2020/02/The-Odyssey.jpg',
        numb: 9,
        price: 10.00,
        publisher: 'Ancient Greece',
        yearPublication: -800,
        createdAt: currentDate,
        id_category: 'C004',
        id_author: 'A005',
        isEnable: true
    },
    {
        id: 'B009',
        name: 'The Hobbit',
        desc: 'A fantasy adventure that follows Bilbo Baggins.',
        imgUrl: 'https://upload.wikimedia.org/wikipedia/vi/e/e3/Ng%C6%B0%E1%BB%9Di_Hobbit_H%C3%A0nh_tr%C3%ACnh_v%C3%B4_%C4%91%E1%BB%8Bnh.jpg',
        numb: 14,
        price: 19.99,
        publisher: 'George Allen & Unwin',
        yearPublication: 1937,
        createdAt: currentDate,
        id_category: 'C005',
        id_author: 'A006',
        isEnable: true
    },
    {
        id: 'B010',
        name: 'Crime and Punishment',
        desc: 'A psychological novel about moral dilemmas and redemption.',
        imgUrl: 'https://marissasbooks.com/cdn/shop/files/marissasbooksandgifts-9781774021897-crime-punishment-paper-mill-classics-38105402605767_grande.webp?v=1696895342',
        numb: 6,
        price: 17.50,
        publisher: 'The Russian Messenger',
        yearPublication: 1866,
        createdAt: currentDate,
        id_category: 'C005',
        id_author: 'A003',
        isEnable: true
    }
]);

const categorySchema = new mongoose.Schema({
    id: String,
    name: String,
    desc: String,
    createdAt: Date,
    isEnable: Boolean
})

const Category = mongoose.model("Category", categorySchema)

Category.create([
    {
        id: 'C001',
        name: 'Classic Literature',
        desc: 'Books that have stood the test of time.',
        createdAt: currentDate,
        isEnable: true
    },
    {
        id: 'C002',
        name: 'Romance',
        desc: 'Books focusing on romantic relationships.',
        createdAt: currentDate,
        isEnable: true
    },
    {
        id: 'C003',
        name: 'Modern Classics',
        desc: 'Contemporary books considered literary masterpieces.',
        createdAt: currentDate,
        isEnable: true
    },
    {
        id: 'C004',
        name: 'Historical Fiction',
        desc: 'Novels set in a particular historical period.',
        createdAt: currentDate,
        isEnable: true
    },
    {
        id: 'C005',
        name: 'Fantasy',
        desc: 'Books that include magical and supernatural elements.',
        createdAt: currentDate,
        isEnable: true
    }
]);

const authorSchema = new mongoose.Schema({
    id: String,
    name: String,
    desc: String,
    nationality: String,
    bio: String,
    isEnable: Boolean
})

const Author = mongoose.model("Author", authorSchema)

Author.create([
    {
        id: 'A001',
        name: 'F. Scott Fitzgerald',
        desc: 'American novelist known for "The Great Gatsby".',
        nationality: 'American',
        bio: 'F. Scott Fitzgerald was an American novelist famous for his depiction of the Jazz Age in the 1920s.',
        isEnable: true
    },
    {
        id: 'A002',
        name: 'Harper Lee',
        desc: 'Author of "To Kill a Mockingbird".',
        nationality: 'American',
        bio: 'Harper Lee was an American novelist, best known for "To Kill a Mockingbird".',
        isEnable: true
    },
    {
        id: 'A003',
        name: 'George Orwell',
        desc: 'English writer famous for dystopian works.',
        nationality: 'British',
        bio: 'George Orwell was a British writer and journalist, best known for his works "1984" and "Animal Farm".',
        isEnable: true
    },
    {
        id: 'A004',
        name: 'Jane Austen',
        desc: 'Renowned for her social commentary in romantic novels.',
        nationality: 'British',
        bio: 'Jane Austen was an English novelist whose works critique the British landed gentry.',
        isEnable: true
    },
    {
        id: 'A005',
        name: 'Leo Tolstoy',
        desc: 'Russian author known for epic novels.',
        nationality: 'Russian',
        bio: 'Leo Tolstoy was a Russian author, best known for his novels "War and Peace" and "Anna Karenina".',
        isEnable: true
    },
    {
        id: 'A006',
        name: 'J.R.R. Tolkien',
        desc: 'Author of the famous fantasy works "The Hobbit" and "The Lord of the Rings".',
        nationality: 'British',
        bio: 'J.R.R. Tolkien was an English writer, poet, and academic known for "The Hobbit" and "The Lord of the Rings".',
        isEnable: true
    }
]);

const userSchema = new mongoose.Schema({
    name: String,
    password: String,
})

const User = mongoose.model("User", userSchema)

User.create([
    {
        name: 'admin',
        password: 'admin'
    },
])

module.exports = {
    Book,
    Category,
    Author,
    User,
};