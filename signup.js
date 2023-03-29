const fileInput = document.getElementById("image");
const imagePreview = document.getElementById("imagepicture");

fileInput.addEventListener("change", function() {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener("load", function() {
      const imageData = reader.result;
      imagePreview.innerHTML = `<img width="100px"  src="${imageData}"/>`;
    //   imagePreview.style.width="200px";
      
      
    });
    
  }
  
});
