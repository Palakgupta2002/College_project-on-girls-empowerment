const avatarInput = document.getElementById('avatar');
const imageHolder = document.getElementById('imageHolder');
const profileDiv = document.getElementById('profile');


avatarInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    imageHolder.innerHTML="";
avatarInput.innerHTML="";
    profileDiv.style.backgroundSize = 'cover'; 
    profileDiv.style.backgroundPosition = 'center'; 
    imageHolder.style.backgroundImage = `url(${e.target.result})`;
  };

  reader.readAsDataURL(file);
});
