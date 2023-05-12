const avatarInput = document.getElementById('avatar');
const imageHolder = document.getElementById('imageHolder');
const profileDiv = document.getElementById('profile');
const profileText=document.getElementById("profileText");
const editIcon = document.querySelector('.edit-icon');

const MAX_WIDTH = 300; // Maximum width in pixels
const MAX_HEIGHT = 300; // Maximum height in pixels

avatarInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    const image = new Image();

    image.onload = function() {
      if (image.width > MAX_WIDTH || image.height > MAX_HEIGHT) {
        alert('Please upload an image with dimensions not exceeding ' + MAX_WIDTH + 'x' + MAX_HEIGHT + ' pixels.');
        // Clear the file input
        avatarInput.value = '';
        // Clear the image holder
        imageHolder.style.backgroundImage = '';
      } else {
        profileText.innerText="Update Your Profile Picture";
        profileText.style.fontSize="20px";
        profileText.style.backgroundColor="grey";
        imageHolder.innerHTML="";
        imageHolder.setAttribute("class","imageholder");
        imageHolder.style.backgroundSize = 'cover'; 
        imageHolder.style.backgroundPosition = 'center'; 
        imageHolder.style.backgroundImage = `url(${e.target.result})`;
        editIcon.style.display = 'block';
      }
    };

    image.src = e.target.result;
  };

  reader.readAsDataURL(file);
});
editIcon.addEventListener('click', function() {
  avatarInput.value = '';
  imagePreview.style.backgroundImage = '';
  avatarInput.style.display = 'block';
  editIcon.style.display = 'none';
});
//javaScript



