// SIGN UP FORM BUTTON CLICK
$('.sign-up-form button[type=submit]').click(function(e){
    e.preventDefault();
    
    $('.success').text("")
    $('.error').text("")

    if($('#password').val() !== $('#confirmPassword').val()){
        $('.error').text("Confirm Password Don't Match");
        return;
    }
    $("body").css('cursor', 'wait')

    // REQUEST TO "/user/sign-up"
    $.ajax({
        method: 'POST',
        url: '/user/sign-up',
        data: $('.sign-up-form').serialize(),
        success: (result)=>{
            if(result.success){
                $('.success').text(result.message + "...Redirecting")
                setTimeout(()=>{
                    $("body").css('cursor', 'default')
                    document.location.href = '/user/sign-in'
                }, 3000)
            }else{
                $("body").css('cursor', 'default')
                $('.error').text(result.message)
            }
        },
        error: (error)=>{
            $("body").css('cursor', 'default')
            console.log(error)
        }
    })
})

// SIGN IN FORM BUTTON CLICK
$('.sign-in-form button[type=submit]').click(function(e){
    e.preventDefault();
    $('.success').text("")
    $('.error').text("")

    $("body").css('cursor', 'wait')
    
    // REQUEST TO "/user/sign-in"
    $.ajax({
        method: 'POST',
        url: '/user/sign-in',
        data: $('.sign-in-form').serialize(),
        success: (result)=>{
            if(result.success){
                $('.success').text(result.message + "...Redirecting")
                setTimeout(()=>{
                    $("body").css('cursor', 'default')
                    document.location.href = '/'
                }, 3000)
            }else{
                $("body").css('cursor', 'default')
                $('.error').text(result.message)
            }
        },
        error: (error)=>{
            $("body").css('cursor', 'default')
            console.log(error)
        }
    })
})

// FORGOT PASSWORD FORM BUTTON CLICK
$('.forgot-password-form button[type=submit]').click(function(e){
    e.preventDefault();
    $('.success').text("")
    $('.error').text("")

    $("body").css('cursor', 'wait')

    // REQUEST TO "/user/forgot-password"
    $.ajax({
        method: 'POST',
        url: '/user/forgot-password',
        data: $('.forgot-password-form').serialize(),
        success: (result)=>{
            if(result.success){
                $('.success').text(result.message)
                $(".forgot-password-form input").prop("disabled", true);
                $(".forgot-password-form button").prop("disabled", true);
                setTimeout(()=>{
                    $("body").css('cursor', 'default')
                }, 3000)
            }else{
                $("body").css('cursor', 'default')
                $('.error').text(result.message)
            }
        },
        error: (error)=>{
            $("body").css('cursor', 'default')
            console.log(error)
        }
    })
})

// RESET PASSWORD FORM BUTTON CLICK
$('.reset-password-form button[type=submit]').click(function(e){
    e.preventDefault();
    $('.success').text("")
    $('.error').text("")

    if($('#password').val() !== $('#confirmPassword').val()){
        $('.error').text("Confirm Password Don't Match");
        return;
    }

    // GET TOKEN FROM URL
    const token = window.location.pathname.split('/')[3];

    $("body").css('cursor', 'wait')
    
    // REQUEST TO "/user/password-reset/:token"
    $.ajax({
        method: 'POST',
        url: '/user/password-reset/' + token,
        data: $('.reset-password-form').serialize(),
        success: (result)=>{
            if(result.success){
                $(".reset-password-form input").prop("disabled", true);
                $(".reset-password-form button").prop("disabled", true);
                $('.success').text(result.message)
                setTimeout(()=>{
                    $("body").css('cursor', 'default')
                    document.location.href = '/user/sign-out'
                }, 3000)
            }else{
                $("body").css('cursor', 'default')
                $('.error').text(result.message)
            }
        },
        error: (error)=>{
            $("body").css('cursor', 'default')
            console.log(error)
        }
    })
})

// PASSWORD RESET DIRECTLY USING EMAIL WHEN USER IS ALREADY SIGNED IN
function sendResetLink(email){
    $("body").css('cursor', 'wait')
    
    // REQUEST TO "/user/forgot-password"
    $.ajax({
        method: 'POST',
        url: '/user/forgot-password',
        data: {email: email},
        success: (result)=>{
            if(result.success){
                setTimeout(()=>{
                    $("body").css('cursor', 'default')
                    document.location.href = '/user/password-reset/' + result.resetToken
                }, 1000)
            }else{
                $("body").css('cursor', 'default')
                $('.error').text(result.message)
            }
        },
        error: (error)=>{
            $("body").css('cursor', 'default')
            console.log(error)
        }
    })
}
