let flag=0;
function controller(x)
{
    flag=flag+x;
    slideshow(flag);
    
}
slideshow(flag);

function slideshow(num)
{
    let image=document.getElementsByClassName('img-1');
    if(num==image.length)
    {
        flag=0;
        num=0;
    }
    if(num<0)
    {
        flag=image.length-1;
        num=image.length-1;
    }
    for(let y of image)
    {
        y.style.display="none";
    }
    image[num].style.display="block";
}