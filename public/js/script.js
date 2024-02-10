document.addEventListener('DOMContentLoaded',function(){

    const buttons=document.querySelectorAll('.searchBtn');
    const searchBar=document.querySelector('.searchBar');
    const searchInput = document.getElementById('searchInput');
    const  searchClose = document.getElementById('searchClose');

    for(var i=0;i< buttons.length;i++){
        buttons[i].addEventListener('click',function(){
            searchBar.style.visibility = 'visible';
            searchBar.classList.add('open');
            this.setAttribute('aria-expanded','true');
            searchInput.focus();
        })
    }

    searchClose.addEventListener('click',()=>{
        searchBar.style.visibility='hidden';
        searchBar.classList.remove('open');
    });
});
// document.addEventListener('DOMContentLoaded',function(){
//     document.querySelector('.reg').addEventListener('click', function() {
//         document.querySelector('.signin').classList.add('hiddenreg');
//         document.querySelector('.hiddenreg').classList.remove('hiddenreg');
//     });

// })