// ДЗ:
//     Створіть папку
// В тій папці створіть 5 папок і 5 файлів
// І за допомогою модулю fs виведіть в консоль, чи це папка чи це файл
//
// FILE: {fileName}
// FOLDER: {folderName}
//
// !руками нічого не робимо, все через fs


const fs = require('fs');

const path = require('path');

const fatherFolder = 'myFolder'

const foldersName = ['folder1', 'folder2', 'folder3', 'folder4', 'folder5']
const filesName = ['text1.txt', 'text2.txt', 'text3.txt', 'text4.txt', 'text5.txt']

fs.mkdir(path.join(__dirname, fatherFolder), (err) => {
    if (err) console.error(`Сталась помилка при створенні папки ${fatherFolder}: ${err}`)
    else
        console.log(`Папку ${fatherFolder} успішно створено.`);
})

foldersName.forEach((folderName) => {
    const foldersNamePath = path.join(fatherFolder, folderName);

    fs.mkdir((foldersNamePath), (err) => {
        if (err) {
            console.error(`Сталась помилка при створенні папки ${foldersNamePath}: ${err}`);
        } else {
            console.log(`Папку ${foldersNamePath} успішно створено.`);
        }
    })
})

filesName.forEach((fileName) => {
    const filesNamePath = path.join(fatherFolder, fileName)

    fs.writeFile(filesNamePath, '', (err) => {
        if (err) {
            console.error(`Сталась помилка при створенні файлу ${filesNamePath}: ${err}`);
        } else {
            console.log(`Файл ${filesNamePath} успішно створено.`);
        }
    })
})


fs.readdir(path.join(fatherFolder), {withFileTypes: true}, (err, files) => {
    if (err) throw new Error(err.message);
    files.forEach(file => {
        if (file.isDirectory()) {
            console.log(`FOLDER`);
        } else if (file.isFile()) {
            console.log(`FILE`);
        }
    })
})

