document.addEventListener("DOMContentLoaded", function() {

	function addOrRemoveClassToAll(selector, addClass, removeClass) {
		document.querySelectorAll(selector).forEach(function(element) {
	        if(typeof addClass !== 'undefined' && addClass.length > 0)
		        element.classList.add(addClass);
	        if(typeof removeClass !== 'undefined' && removeClass.length > 0)
		        element.classList.remove(removeClass);
		});
	}

	function toggleColorClass(selector) {
		document.querySelectorAll(selector).forEach(function(element) {
			if(element.checked === false) {
		        // element.parentNode.classList.remove('checked');
		        element.parentNode.classList.add('color');
		    };
		});
	}

	document.querySelectorAll('.resizer-social-option.stepA input').forEach(function(element) {
		element.addEventListener('click', function(event) {
			// Снимаем выделение с других кнопок размера, они становятся цветными
			toggleColorClass('.resizer-social-option.stepA input');

	        document.querySelector('.video-uploaded .resizer-fit-preview').classList.remove('resizer-fit-11','resizer-fit-916','resizer-fit-169','resizer-fit-45');
	        document.querySelector('.video-uploaded .resizer-fit-preview').classList.add('resizer-fit-'+this.value);
	        
	        if(!this.parentNode.parentNode.classList.contains('hide')) {
		        addOrRemoveClassToAll('.resizer-social-option.stepA', 'hide');
		        addOrRemoveClassToAll('.resizer-social-option.stepB', '', 'hide');
	        } else {
		        addOrRemoveClassToAll('.resizer-social-option.stepA', '', 'hide');
		        addOrRemoveClassToAll('.resizer-social-option.stepB', 'hide');
	        }

	        // this.parentNode.classList.add('checked');
	        this.parentNode.classList.toggle('color');
	        this.parentNode.parentNode.classList.toggle('show');

	        resizeFitPreview('resizer-fit-'+this.value);
	    });
	});
	document.querySelectorAll('.resizer-social-option.stepB input').forEach(function(element) {
		element.addEventListener('click', function(event) {

			if(element.value === 'crop') {
				document.querySelector('.video-uploaded .resizer-fit-video.first').classList.toggle('cover');
				document.querySelector('.video-uploaded .resizer-fit-preview').classList.toggle('bgblack');
				document.querySelector('.video-uploaded .resizer-fit-video.second').classList.remove('blur');
				document.querySelector('.video-uploaded .resizer-fit-video.second').classList.add('hide');
			}
			if(element.value === 'blur') {
				document.querySelector('.video-uploaded .resizer-fit-video.second').classList.toggle('blur');
				document.querySelector('.video-uploaded .resizer-fit-video.second').classList.toggle('hide');
				if(document.querySelector('.video-uploaded .resizer-fit-video.second').classList.contains('blur')) {
					document.querySelector('.video-uploaded .resizer-fit-video.second').pause();
					document.querySelector('.video-uploaded .resizer-fit-video.first').pause();
					document.querySelector('.video-uploaded .resizer-fit-video.second').currentTime = document.querySelector('.video-uploaded .resizer-fit-video.first').currentTime;
					document.querySelector('.video-uploaded .resizer-fit-video.second').play();
					document.querySelector('.video-uploaded .resizer-fit-video.first').play();
				}
				document.querySelector('.video-uploaded .resizer-fit-preview').classList.add('bgblack');
				document.querySelector('.video-uploaded .resizer-fit-video.first').classList.remove('cover');
			}
			if(element.value === 'render') {
				addOrRemoveClassToAll('.resizer-social-option.stepA.show', '', 'show');
				addOrRemoveClassToAll('.resizer-social-option.stepB', 'hide');
				addOrRemoveClassToAll('.resizer-social-option.stepC', '', 'hide');
			} else {
				toggleColorClass('.resizer-social-option.stepB input');
				this.parentNode.classList.toggle('color');
			}

	    });
	});
	document.querySelectorAll('.resizer-social-option.stepC input').forEach(function(element) {
		element.addEventListener('click', function(event) {
			// toggleColorClass('.resizer-social-option.stepC input');
			// this.parentNode.classList.toggle('color');

			if(element.value === 'new') {
				addOrRemoveClassToAll('.resizer-social-option.stepA', '', 'hide');
				addOrRemoveClassToAll('.resizer-social-option.stepC', 'hide');
			    document.querySelector('#dropzone').style.display = '';
			    document.querySelector('.video-uploaded').style.display = '';
			    // addOrRemoveClassToAll('.resizer-social-option radio-label').classList.remove('color');
			}
	    });
	});

	function resizeFitPreview(fitSizeClass) {
		if(fitSizeClass === undefined) {
			var div = document.querySelector('.video-uploaded .resizer-fit-preview');
			div.classList.remove('resizer-fit-preview', 'video-preview-container');
			fitSizeClass = div.classList[0];
			div.classList.add('resizer-fit-preview', 'video-preview-container');
		}

		switch (fitSizeClass) {
	        	case "resizer-fit-11":
	        		document.querySelector('.video-uploaded .'+fitSizeClass).style.height = document.querySelector('.video-uploaded .'+fitSizeClass).getBoundingClientRect().width+'px';
	        		break;
	        	case "resizer-fit-916":
	        		document.querySelector('.video-uploaded .'+fitSizeClass).style.height = document.querySelector('.video-uploaded .'+fitSizeClass).getBoundingClientRect().width/9*16+'px';
	        		break;
	        	case "resizer-fit-169":
	        		document.querySelector('.video-uploaded .'+fitSizeClass).style.height = document.querySelector('.video-uploaded .'+fitSizeClass).getBoundingClientRect().width/16*9+'px';
	        		break;
	        	case "resizer-fit-45":
	        		document.querySelector('.video-uploaded .'+fitSizeClass).style.height = document.querySelector('.video-uploaded .'+fitSizeClass).getBoundingClientRect().width/4*5+'px';
	        		break;
	        	default:
	        }
	}

	Dropzone.autoDiscover = false;

	var dropzoneItem = new Dropzone('#video_upload', {
	  previewTemplate: document.querySelector('#preview-template').innerHTML,
	  parallelUploads: 1,
	  uploadMultiple: false,
	  maxFiles: 1,
	  maxFilesize: 500,
	  thumbnailHeight: 120,
	  thumbnailWidth: 120,
	  filesizeBase: 1000,
	  acceptedFiles: '.mp4',
	  
	  init: function () {
		this.on("error", function(file) {
		    // alert("error");
		});
		/*
		this.on("drop", function(file) {
		    // alert("drop");
			var progressBar =
			    new ProgressBar.Circle('#progress', {
			        color: '#e91e63',
			        strokeWidth: 50,
			        duration: 2000, // milliseconds
			        easing: 'easeInOut'
			    });

			progressBar.animate(0.8);
		});
		*/
		this.on("error", function(file) {

		});
		this.on("success", function(file) {
		    // alert("complete");
		    document.querySelector('#dropzone').style.display = 'none';
		    document.querySelector('.video-uploaded').style.display = 'initial';

		    var videos = ['uploads/thanosMovie.mp4', 'uploads/1x1.mp4', 'uploads/916.mp4'];
		    if(location.hostname == 'localhost') {
		    	videos = ['uploads/thanosMovie.mp4', 'uploads/1x1.mp4', 'uploads/916.mp4'];
		    }
		    if(parseInt(sessionStorage.getItem('numVideo')) < videos.length-1) {
		    	sessionStorage.setItem('numVideo', parseInt(sessionStorage.getItem('numVideo'))+1);
		    } else {
		    	sessionStorage.setItem('numVideo', 0);
		    }
		    var divVideo = '<video class="resizer-fit-video" muted loop="" autoplay="" preload="auto" playsinline="" style="">\
					<source src="'+videos[sessionStorage.getItem('numVideo')]+'" type="video/mp4" />\
				</video>';
			document.querySelector('.video-uploaded  .resizer-fit-preview').innerHTML = divVideo;
			document.querySelector('.video-uploaded  .resizer-fit-preview').innerHTML += divVideo;
			document.querySelectorAll('.video-uploaded  .resizer-fit-video')[0].classList.add('first');
			document.querySelectorAll('.video-uploaded  .resizer-fit-video')[1].classList.add('second', 'hide');
		    resizeFitPreview();
		    
		    document.querySelectorAll('.resizer-social-option input:disabled').forEach(function(element) {
				if(element.disabled === true) {
					element.disabled = false;
			        // element.parentNode.classList.remove('checked');
			        element.parentNode.classList.add('color');
			    };
			});
		});
	  }

	});

	
	document.querySelector('.resizer-social-option.stepC input[value="new"]').addEventListener('click', function(event) {
		dropzoneItem.removeAllFiles();
		document.querySelectorAll('.resizer-social-option input').forEach(function(element) {
				if(element.disabled === false) {
					element.disabled = true;
			        // element.parentNode.classList.remove('checked');
			        element.parentNode.classList.remove('color');
			    };
			});
	});

	// Now fake the file upload, since GitHub does not handle file uploads
	// and returns a 404

	var minSteps = 25,
	    maxSteps = 50,
	    timeBetweenSteps = 100,
	    bytesPerStep = 100000;

	dropzoneItem.uploadFiles = function(files) {
	  var self = this;

	  for (var i = 0; i < files.length; i++) {

	    var file = files[i];
	    totalSteps = Math.round(Math.min(maxSteps, Math.max(minSteps, file.size / bytesPerStep)));

	    for (var step = 0; step < totalSteps; step++) {
	      var duration = timeBetweenSteps * (step + 1);
	      setTimeout(function(file, totalSteps, step) {
	        return function() {
	          file.upload = {
	            progress: 100 * (step + 1) / totalSteps,
	            total: file.size,
	            bytesSent: (step + 1) * file.size / totalSteps
	          };

	          self.emit('uploadprogress', file, file.upload.progress, file.upload.bytesSent);
	          if (file.upload.progress == 100) {
	            file.status = Dropzone.SUCCESS;
	            self.emit("success", file, 'success', null);
	            self.emit("complete", file);
	            self.processQueue();
	            //document.getElementsByClassName("dz-success-mark").style.opacity = "1";
	          }
	        };
	      }(file, totalSteps, step), duration);
	    }
	  }
	}

});
