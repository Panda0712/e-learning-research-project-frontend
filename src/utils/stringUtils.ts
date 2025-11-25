export const removeVietnameseMarks = (str: string): string => {
    // Chuyển đổi chuỗi sang dạng không dấu
 // Nguyên âm A
    str = str.replace(/á/g, "as");
    str = str.replace(/à/g, "af");
    str = str.replace(/ả/g, "ar");
    str = str.replace(/ã/g, "ax");
    str = str.replace(/ạ/g, "aj");
    
    // Nguyên âm Ă (aw)
    str = str.replace(/ă/g, "aw");

    // Nguyên âm Â (aa)
    str = str.replace(/â/g, "aa");

    // Nguyên âm E
    str = str.replace(/é/g, "es");
    str = str.replace(/è/g, "ef");
    str = str.replace(/ẻ/g, "er");
    str = str.replace(/ẽ/g, "ex");
    str = str.replace(/ẹ/g, "ej");

    // Nguyên âm Ê (ee)
    str = str.replace(/ê/g, "ee");

    // Nguyên âm I
    str = str.replace(/í/g, "is");
    str = str.replace(/ì/g, "if");
    str = str.replace(/ỉ/g, "ir");
    str = str.replace(/ĩ/g, "ix");
    str = str.replace(/ị/g, "ij");

    // Nguyên âm O
    str = str.replace(/ó/g, "os");
    str = str.replace(/ò/g, "of");
    str = str.replace(/ỏ/g, "or");
    str = str.replace(/õ/g, "ox");
    str = str.replace(/ọ/g, "oj");
    
    // Nguyên âm Ô (oo)
    str = str.replace(/ô/g, "oo");

    // Nguyên âm Ơ (ow)
    str = str.replace(/ơ/g, "ow");

    // Nguyên âm U
    str = str.replace(/ú/g, "us");
    str = str.replace(/ù/g, "uf");
    str = str.replace(/ủ/g, "ur");
    str = str.replace(/ũ/g, "ux");
    str = str.replace(/ụ/g, "uj");

    // Nguyên âm Ư (uw)
    str = str.replace(/ư/g, "uw");

    // Nguyên âm Y
    str = str.replace(/ý/g, "ys");
    str = str.replace(/ỳ/g, "yf");
    str = str.replace(/ỷ/g, "yr");
    str = str.replace(/ỹ/g, "yx");
    str = str.replace(/ỵ/g, "yj");

    // Chữ Đ
    str = str.replace(/đ/g, "dd");

    // --- KÝ TỰ HOA ---
    
    // Nguyên âm A Hoa
    str = str.replace(/Á/g, "As");
    str = str.replace(/À/g, "Af");
    str = str.replace(/Ả/g, "Ar");
    str = str.replace(/Ã/g, "Ax");
    str = str.replace(/Ạ/g, "Aj");

    // Nguyên âm Ă Hoa (AW)
    str = str.replace(/Ă/g, "Aw");

    // Nguyên âm Â Hoa (AA)
    str = str.replace(/Â/g, "Aa");

    // Nguyên âm E Hoa
    str = str.replace(/É/g, "Es");
    str = str.replace(/È/g, "Ef");
    str = str.replace(/Ẻ/g, "Er");
    str = str.replace(/Ẽ/g, "Ex");
    str = str.replace(/Ẹ/g, "Ej");

    // Nguyên âm Ê Hoa (EE)
    str = str.replace(/Ê/g, "Ee");

    // Nguyên âm I Hoa
    str = str.replace(/Í/g, "Is");
    str = str.replace(/Ì/g, "If");
    str = str.replace(/Ỉ/g, "Ir");
    str = str.replace(/Ĩ/g, "Ix");
    str = str.replace(/Ị/g, "Ij");

    // Nguyên âm O Hoa
    str = str.replace(/Ó/g, "Os");
    str = str.replace(/Ò/g, "Of");
    str = str.replace(/Ỏ/g, "Or");
    str = str.replace(/Õ/g, "Ox");
    str = str.replace(/Ọ/g, "Oj");
    
    // Nguyên âm Ô Hoa (OO)
    str = str.replace(/Ô/g, "Oo");

    // Nguyên âm Ơ Hoa (OW)
    str = str.replace(/Ơ/g, "Ow");

    // Nguyên âm U Hoa
    str = str.replace(/Ú/g, "Us");
    str = str.replace(/Ù/g, "Uf");
    str = str.replace(/Ủ/g, "Ur");
    str = str.replace(/Ũ/g, "Ux");
    str = str.replace(/Ụ/g, "Uj");

    // Nguyên âm Ư Hoa (UW)
    str = str.replace(/Ư/g, "Uw");

    // Nguyên âm Y Hoa
    str = str.replace(/Ý/g, "Ys");
    str = str.replace(/Ỳ/g, "Yf");
    str = str.replace(/Ỷ/g, "Yr");
    str = str.replace(/Ỹ/g, "Yx");
    str = str.replace(/Ỵ/g, "Yj");

    // Chữ Đ Hoa
    str = str.replace(/Đ/g, "Dd");
    return str;
};