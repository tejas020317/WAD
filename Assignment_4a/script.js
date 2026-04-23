$(document).ready(function() {
    // Fade in the page content for a smooth transition effect
    $('body').fadeIn(800);

    // Highlight active navigation link based on current URL
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    $('.nav-links a').each(function() {
        if ($(this).attr('href') === currentPath) {
            $(this).addClass('active');
        }
    });

    // Mobile Menu Toggle with slide toggle effect
    $('#mobileBtn').on('click', function() {
        $('#navLinks').slideToggle(300, function() {
            $(this).toggleClass('active').css('display', '');
        });
    });

    // Close mobile menu when a link is clicked
    $('.nav-links a').on('click', function(e) {
        // Animate fading out out the body if navigating to another page
        const targetUrl = $(this).attr('href');
        e.preventDefault();
        
        $('body').fadeOut(400, function() {
            window.location.href = targetUrl;
        });
    });

    // Hover effect for cards using jQuery
    $('.card').hover(
        function() {
            $(this).animate({ marginTop: "-10px" }, 200);
        },
        function() {
            $(this).animate({ marginTop: "0px" }, 200);
        }
    );

    // Simple Form Validation with jQuery Animations
    $('#feedbackForm').on('submit', function(e) {
        e.preventDefault(); // Prevent page reload
        
        let isValid = true;
        
        const $nameInput = $('#name');
        const $emailInput = $('#email');
        
        const $nameError = $('#nameError');
        const $emailError = $('#emailError');
        
        // Reset errors
        $nameError.slideUp(200);
        $emailError.slideUp(200);
        $nameInput.css('border-color', '#ccc');
        $emailInput.css('border-color', '#ccc');

        // Validate Name
        if ($nameInput.val().trim() === '') {
            $nameError.slideDown(200);
            $nameInput.css('border-color', '#d9534f');
            // Shake effect
            $nameInput.effect ? $nameInput.effect("shake", { distance: 5 }) : null;
            isValid = false;
        }

        // Validate Email (basic check)
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if ($emailInput.val().trim() === '' || !emailPattern.test($emailInput.val().trim())) {
            $emailError.slideDown(200);
            $emailInput.css('border-color', '#d9534f');
            isValid = false;
        }

        // If valid, show success
        if (isValid) {
            const $btn = $('#submitBtn');
            const originalText = $btn.html();
            
            $btn.fadeOut(200, function() {
                $(this).html('Sent Successfully!').css('background-color', '#558750').fadeIn(200);
            });
            
            // Clear form
            this.reset();
            
            // Reset button text after 3 seconds
            setTimeout(() => {
                $btn.fadeOut(200, function() {
                    $(this).html(originalText).css('background-color', '').fadeIn(200);
                });
            }, 3000);
        }
    });
});
