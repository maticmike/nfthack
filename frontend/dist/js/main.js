var alertModal = new bootstrap.Modal(document.getElementById('alertModal'));
$('.menu-toggle').on('click', function(){
    $('html').attr('data-menu', 'open')
})

$('.js-blocker').on('click', function(){
    $('html').attr('data-menu', 'closed');
})

$('.flyout-menu-close').on('click', function(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    $('html').attr('data-menu', 'closed');
})


$(document).on('click', '.flyout-menu a.scroll-to', function(){
    $('html').attr('data-menu', 'closed');
});

function fadeOutGetID(){
    var id = $('.team.active').attr('data-id');
    $('.team.active').fadeOut(100);
    $('.team.active').removeClass('active');
    return id;
}

$(function(){
    if(!(/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i).test(navigator.userAgent || navigator.vendor || window.opera)){
        skrollr.init({
                smoothScrolling: true,
                mobileDeceleration: 0.004,
                forceHeight: false
        });
    }

    let id = 1;
    setInterval(() => {
        setTimeout(function(){
            switch(id){
                case 6:
                   $('.team picture source').attr('srcset', 'dist/img/1.webp');
                    $('.team picture img').attr('src', 'dist/img/1.jpg');
                    id = 2;
                break;
                default:
                    $('.team picture source').attr('srcset', 'dist/img/' + id.toString() + '.webp');
                    $('.team picture img').attr('src', 'dist/img/' + id.toString() + '.jpg');
                    id++;
                break;
            }
            
        }, 100)
    }, 1000);
})