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
	        
	        resizeFitPreview('resizer-fit-'+this.value);

	        // this.parentNode.classList.add('checked');
	        this.parentNode.classList.remove('color');
	    });
	});

	function resizeFitPreview(fitSizeClass) {
		if(fitSizeClass === undefined) {
			var div = document.querySelector('.video-uploaded .resizer-fit-preview');
			div.classList.remove('resizer-fit-preview', 'video-preview-container');
			fitSizeClass = div.classList[0];
			div.classList.add('resizer-fit-preview', 'video-preview-container');
		}
		console.log(fitSizeClass);

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

	var dropzone = new Dropzone('#video_upload', {
	  previewTemplate: document.querySelector('#preview-template').innerHTML,
	  parallelUploads: 1,
	  uploadMultiple: false,
	  maxFiles: 1,
	  maxFilesize: 500,
	  thumbnailHeight: 120,
	  thumbnailWidth: 120,
	  filesizeBase: 1000,
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
		this.on("complete", function(file) {
		    // alert("complete");
		    document.querySelector('#dropzone').style.display = 'none';
		    document.querySelector('.video-uploaded').style.display = 'initial';

		    var videos = ['https://r1---sn-q4flrnek.googlevideo.com/videoplayback?expire=1569251758&ei=To2IXa3WCYXLigSM157QCQ&ip=2600%3A1900%3A2000%3A37%3A400%3A%3A13&id=o-ADxX4tJOomrEIzb6AEuc9hPJQvJFgnFLD9BXwkfVKdTM&itag=22&source=youtube&requiressl=yes&mm=31%2C26&mn=sn-q4flrnek%2Csn-5hnednlk&ms=au%2Conr&mv=m&mvi=0&pl=65&initcwndbps=6582500&mime=video%2Fmp4&ratebypass=yes&dur=18.041&lmt=1565905632800432&mt=1569230079&fvip=6&c=WEB&txp=2316222&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cmime%2Cratebypass%2Cdur%2Clmt&sig=ALgxI2wwRgIhAIlmkPiGOWfAUJWdZ-BSJSuRPzsrTsBQvnHfVWjROOukAiEAt3c31K1wEuLWIPqRjujfX3Wc3ibdKEtnXZalcZKzee4%3D&lsparams=mm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AHylml4wRgIhAIS36oOkQC7mnfW3CFP-i7WdBpHeBZxdxMwy8NS4UShTAiEAnvDf7Zio8vn-IfXlsI9YnP5HiQNmkHQ6BAV4OcavPfg%3D','https://r2---sn-q4fl6ney.googlevideo.com/videoplayback?expire=1569247679&ei=X32IXau1JIrvwQGdzoCQBQ&ip=2600%3A1900%3A2000%3A1d%3A400%3A%3A13&id=o-AHCrPevU7qHJvWjrym6yMFhWguaAa4OA99CcZkk24rB5&itag=22&source=youtube&requiressl=yes&mm=31%2C26&mn=sn-q4fl6ney%2Csn-5hnekn7d&ms=au%2Conr&mv=m&mvi=1&pl=65&initcwndbps=8587500&mime=video%2Fmp4&ratebypass=yes&dur=15.092&lmt=1520237366995284&mt=1569225949&fvip=2&c=WEB&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cmime%2Cratebypass%2Cdur%2Clmt&sig=ALgxI2wwRAIgVdG9PiXjb8b71EsXmv4geyObNrsOBR3ZMjLL8FHdDrUCIDQsdx-KSoYV25UB_hk0FD8qK6xlTNUvCTlJYBQU71JK&lsparams=mm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AHylml4wRAIgZMlk0qh0Nz95H7AQVPUrnmQClFIfiUV3ukxkTlhoG0gCIE6m-14rRpMbvZOVTTZ5nvvx2dS9cR5Iaxh2mz50lAwp', 'https://r1---sn-a5meknsy.googlevideo.com/videoplayback?expire=1569248063&ei=336IXdLSDMWOtQfnsamADA&ip=2600%3A1900%3A2000%3A37%3A400%3A%3A13&id=o-AENR0t-f4n2Yw7iZ8Y_uMRan_156WhdhDYw_3PKbm5tg&itag=22&source=youtube&requiressl=yes&mime=video%2Fmp4&ratebypass=yes&dur=47.090&lmt=1520355088013106&fvip=1&c=WEB&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cmime%2Cratebypass%2Cdur%2Clmt&sig=ALgxI2wwRQIhAPbLDkqSffd3jAxAGN8rQdh37-SRitw0k9eEwdxILC-RAiBKJTwT82tFmDxf9a7D_8NHfYN-TAsD0iFmHXuFVAXmaA%3D%3D&redirect_counter=1&cm2rm=sn-q4fel67e&req_id=3591df5f686536e2&cms_redirect=yes&mip=31.171.194.226&mm=34&mn=sn-a5meknsy&ms=ltu&mt=1569226002&mv=D&mvi=0&pl=0&lsparams=mip,mm,mn,ms,mv,mvi,pl&lsig=AHylml4wRQIgTI8HlKHucba5F0yJ0abugbPw2KWVnVk7vYl5M5CROzMCIQCCOxocu4Zsqr9xeje-zBzDvCy8De3L8Oalzjd8A3OjNA==', 'https://r5---sn-n8v7znss.googlevideo.com/videoplayback?expire=1569248351&ei=_n-IXbH9OcCLir4P_-mw-A4&ip=2600%3A1900%3A2000%3A1d%3A400%3A%3A13&id=o-AI-eBrXcasdV42rnAQ5-8LRYoOZyAxfFB2ao2wbCEKFu&itag=22&source=youtube&requiressl=yes&mime=video%2Fmp4&ratebypass=yes&dur=18.065&lmt=1485763834769342&fvip=5&c=WEB&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cmime%2Cratebypass%2Cdur%2Clmt&sig=ALgxI2wwRAIgXfGeRD9ryrUu122YpinFEfmKZxYTEuQ1EE_nJmbhC3ACICT-E18Fl0pQzlw5U6xOgs6F7J-C6EwjiMyNE-0Pa_11&rm=sn-q4f6l7e&fexp=9420243&req_id=966001aee85136e2&ipbypass=yes&redirect_counter=2&cm2rm=sn-xbnuxaxjvhg0-304e7l&cms_redirect=yes&mip=31.171.194.226&mm=29&mn=sn-n8v7znss&ms=rdu&mt=1569226610&mv=m&mvi=4&pl=21&lsparams=ipbypass,mip,mm,mn,ms,mv,mvi,pl&lsig=AHylml4wRQIhAKp-S3H1NJJ-cXoJ1a6wGcKcnIdSq-Mj_llhuEVPMpk_AiBvrRU6-O_BcUeGznV_e626Cd456dMrt9HgVlRYfl4Stw==']
		    if(parseInt(sessionStorage.getItem('numVideo')) < videos.length-1) {
		    	sessionStorage.setItem('numVideo', parseInt(sessionStorage.getItem('numVideo'))+1);
		    } else {
		    	sessionStorage.setItem('numVideo', 0);
		    }
		    document.querySelector('.video-uploaded  .resizer-fit-preview').innerHTML = '<video class="resizer-fit-video" muted loop="" autoplay="" preload="auto" playsinline="" style="">\
					<source src="'+videos[sessionStorage.getItem('numVideo')]+'" type="video/mp4" />\
				</video>'
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


	// Now fake the file upload, since GitHub does not handle file uploads
	// and returns a 404

	var minSteps = 50,
	    maxSteps = 100,
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
