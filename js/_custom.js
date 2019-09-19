document.addEventListener("DOMContentLoaded", function() {

	/* */
	document.querySelectorAll('.resizer-social-option input').forEach(function(element) {
		element.addEventListener('click', function(event) {
			document.querySelectorAll('.resizer-social-option input').forEach(function(element) {
				if(element.checked === false) {
			        // element.parentNode.classList.remove('checked');
			        element.parentNode.classList.add('color');
			    };
			});

	        // this.parentNode.classList.add('checked');
	        this.parentNode.classList.remove('color');
	    });
	});


});

window.onload = function onLoad() {
  var progressBar = 
    new ProgressBar.Circle('#progress', {
      color: '#e91e63',
      strokeWidth: 50,
      duration: 2000, // milliseconds
      easing: 'easeInOut'
    });

  progressBar.animate(0.8); // percent
};