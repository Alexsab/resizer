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
	        document.querySelector('.video-uploaded .resizer-fit-preview').classList.remove('resizer-fit-11','resizer-fit-916','resizer-fit-169','resizer-fit-45');
	        document.querySelector('.video-uploaded .resizer-fit-preview').classList.add('resizer-fit-'+this.value);

	        // this.parentNode.classList.add('checked');
	        this.parentNode.classList.remove('color');
	    });
	});

	var dropzone = new Dropzone('#video_upload', {
	  previewTemplate: document.querySelector('#preview-template').innerHTML,
	  parallelUploads: 1,
	  uploadMultiple: false,
	  maxFiles: 1,
	  maxFilesize: 500,
	  thumbnailHeight: 120,
	  thumbnailWidth: 120,
	  filesizeBase: 1000,
	  thumbnail: function(file, dataUrl) {
	    if (file.previewElement) {
	      file.previewElement.classList.remove("dz-file-preview");
	      var images = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
	      for (var i = 0; i < images.length; i++) {
	        var thumbnailElement = images[i];
	        thumbnailElement.alt = file.name;
	        thumbnailElement.src = dataUrl;
	      }
	      setTimeout(function() { file.previewElement.classList.add("dz-image-preview"); }, 1);
	    }
	  },
	  init: function () {
		this.on("error", function(file) {
		    // alert("error");
		});
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
		this.on("complete", function(file) {
		    // alert("complete");
		    document.querySelector('#dropzone').style.display = 'none';
		    document.querySelector('.video-uploaded').style.display = 'initial';
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


	// Now fake the file upload, since GitHub does not handle file uploads
	// and returns a 404

	var minSteps = 6,
	    maxSteps = 60,
	    timeBetweenSteps = 100,
	    bytesPerStep = 100000;

	dropzone.uploadFiles = function(files) {
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
