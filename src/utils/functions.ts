export const splitScripts = (script: string): string[] => {
  const arrScript: string[] = [];
  let currentText = '';

  // Chia script thành các câu (kết thúc bằng . ! ? hoặc xuống dòng)
  const sentences = script.split(/([.!?]\s*|\n)/);

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];

    // Kiểm tra nếu thêm câu này vào có vượt quá 1000 ký tự không
    if ((currentText + sentence).length > 1000) {
      // Nếu currentText không rỗng, push vào array
      if (currentText.trim()) {
        arrScript.push(currentText.trim());
        currentText = '';
      }

      // Nếu câu hiện tại dài hơn 1000 ký tự, chia nhỏ ra
      if (sentence.length > 1000) {
        let index = 0;
        while (index < sentence.length) {
          const chunk = sentence.slice(index, index + 1000);
          arrScript.push(chunk);
          index += 1000;
        }
      } else {
        currentText = sentence;
      }
    } else {
      currentText += sentence;
    }
  }

  // Thêm phần còn lại vào array nếu có
  if (currentText.trim()) {
    arrScript.push(currentText.trim());
  }

  // Loại bỏ các phần tử rỗng
  return arrScript.filter(text => text.length > 0);
};
