const extendFunctions = {
  getAvatarName: (name) => {
    // Tách chuỗi thành mảng các từ
    const fullName = name.split(" ");
    // Lấy chữ cái đầu của họ
    const ho = fullName[0][0].toUpperCase();
    // Lấy chữ cái đầu của tên
    const ten = fullName[fullName.length - 1][0].toUpperCase();
    // Trả về kết quả
    const result = ho + "" + ten;
    return result;
  },
  randomImage: () => {
    const images = [
      "https://res.cloudinary.com/dxyxfr1bj/image/upload/v1709199388/Nhom11_CNM/cdi5rhhgp74ple3gmbbc.jpg",
      "https://res.cloudinary.com/dxyxfr1bj/image/upload/v1709199387/Nhom11_CNM/ticao0bydhwr7acbcgjh.jpg",
      "https://res.cloudinary.com/dxyxfr1bj/image/upload/v1709199387/Nhom11_CNM/tz2dlrztoarqjoml0um7.jpg",
      "https://res.cloudinary.com/dxyxfr1bj/image/upload/v1709199387/Nhom11_CNM/iuhpcf7r4azzh6ust2nd.jpg",
      "https://res.cloudinary.com/dxyxfr1bj/image/upload/v1709199386/Nhom11_CNM/fzdkkdsgtqkenoyvoseu.jpg",
      "https://res.cloudinary.com/dxyxfr1bj/image/upload/v1709199386/Nhom11_CNM/iotnltdy8g2uykqp61uu.jpg",
      "https://res.cloudinary.com/dxyxfr1bj/image/upload/v1709199386/Nhom11_CNM/fq6xzfhinkhjstvy3sym.jpg",
      "https://res.cloudinary.com/dxyxfr1bj/image/upload/v1709199385/Nhom11_CNM/etehp2tbr7jaobwwn8fp.jpg",
      "https://res.cloudinary.com/dxyxfr1bj/image/upload/v1709199384/Nhom11_CNM/sjlt2txlcqiz7byq1sfl.jpg",
      "https://res.cloudinary.com/dxyxfr1bj/image/upload/v1709198598/Nhom11_CNM/n4lf86uufmfkc9qa4wud.jpg",
      "https://res.cloudinary.com/dxyxfr1bj/image/upload/v1709200595/Nhom11_CNM/g7hs0ctih2avvds222bw.jpg",
      "https://res.cloudinary.com/dxyxfr1bj/image/upload/v1709200595/Nhom11_CNM/xmrmnnmysltteyyxz8ju.jpg",
      "https://res.cloudinary.com/dxyxfr1bj/image/upload/v1709200594/Nhom11_CNM/tyl5jbq0onpqgxwdtbnd.jpg",
      "https://res.cloudinary.com/dxyxfr1bj/image/upload/v1709200594/Nhom11_CNM/z869adobd4meuzrji8lw.jpg",
      "https://res.cloudinary.com/dxyxfr1bj/image/upload/v1709200593/Nhom11_CNM/uiuoebtfacjow06htqok.jpg",
      "https://res.cloudinary.com/dxyxfr1bj/image/upload/v1709200593/Nhom11_CNM/zga1wb9fxtsvtse5wxow.jpg",
      "",
    ];
    const randomIndex = Math.floor(Math.random() * images.length);
    const randomImage = images[randomIndex];
    return randomImage;
  },
};
export default extendFunctions;
