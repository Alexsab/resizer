document.addEventListener("DOMContentLoaded", function() {

	/**
	 * возвращает cookie если есть или undefined
	 * @param  {[type]} name название cookie
	 * @return {[type]}      [description]
	 */
	function getCookie(name) {
	    var matches = document.cookie.match(new RegExp(
	      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	    ))
	    return matches ? decodeURIComponent(matches[1]) : undefined
	}

	/**
	 * уcтанавливает cookie
	 * @param {[type]} name  название cookie
	 * @param {String} value значение cookie (строка)
	 * @param {[type]} props Объект с дополнительными свойствами для установки cookie:
	 *                       expires
	 *                       	Время истечения cookie. Интерпретируется по-разному, 
	 *                       	в зависимости от типа:
	 *                        	Если число - количество секунд до истечения.
	 *                         	Если объект типа Date - точная дата истечения.
	 *                          Если expires в прошлом, то cookie будет удалено.
	 *                          Если expires отсутствует или равно 0, то cookie будет 
	 *                          установлено как сессионное и исчезнет при закрытии браузера.
	 *                       path
	 *                       	Путь для cookie.
	 *                       domain
	 *                       	Домен для cookie.
	 *                       secure
	 *                       	Пересылать cookie только по защищенному соединению.
	 */
	function setCookie(name, value, props) {
	    props = props || {}
	    var exp = props.expires
	    if (typeof exp == "number" && exp) {
	        var d = new Date()
	        d.setTime(d.getTime() + exp*1000)
	        exp = props.expires = d
	    }
	    if(exp && exp.toUTCString) { props.expires = exp.toUTCString() }
	    value = encodeURIComponent(value)
	    var updatedCookie = name + "=" + value
	    for(var propName in props){
	        updatedCookie += "; " + propName
	        var propValue = props[propName]
	        if(propValue !== true){ updatedCookie += "=" + propValue }
	    }
	    document.cookie = updatedCookie
	}

	/**
	 * удаляет cookie
	 * @param  {[type]} name название cookie
	 * @return {[type]}      [description]
	 */
	function deleteCookie(name) {
	    setCookie(name, null, { expires: -1 })
	}

	var videos = [
    	{'success': true, 'R': 'H', 'renderId': 1, 'file': 'uploads/thanosMovie.mp4'}, 
    	{'success': true, 'R': 'S', 'renderId': 1, 'file': 'uploads/1x1.mp4'}, 
    	{'success': true, 'R': 'V', 'renderId': 1, 'file': 'uploads/916.mp4'}, 
    	{'success': true, 'R': 'F', 'renderId': 1, 'file': 'uploads/4x5.mp4'}
    ];
    if(location.hostname == 'localhost') {
    	videos = [
	    	{'success': true, 'R': 'H', 'renderId': 1, 'file': 'uploads/thanosMovie.mp4'}, 
	    	{'success': true, 'R': 'S', 'renderId': 1, 'file': 'uploads/1x1.mp4'}, 
	    	{'success': true, 'R': 'V', 'renderId': 1, 'file': 'uploads/916.mp4'}, 
	    	{'success': true, 'R': 'F', 'renderId': 1, 'file': 'uploads/4x5.mp4'}
    	];
    }	

    var video = [];

	if(localStorage.serviceToken === undefined) {
		// localStorage.clear('env');
		localStorage.env = prompt('Please enter service token:', 'dev2');
	}
	console.log('You use env: ' + localStorage.env);
	if(localStorage.serviceToken === undefined || localStorage.serviceToken.length < 15) {
		// localStorage.clear('serviceToken');
		localStorage.serviceToken = prompt('Please enter service token:', 'gobbledygook'); 
	}
	if (localStorage.serviceToken === 'null') { 
		console.log('User cancelled serviceToken, start example mode.'); 
	} else {
		console.log('You use token: ' + localStorage.serviceToken);
	}

	var $ = function(name) { return document.querySelector(name) }
	var $$ = function(name) { return document.querySelectorAll(name) }

	/**
	 * добавить или удалить класс у всех элементов
	 * @param {[type]} selector    [description]
	 * @param {[type]} addClass    [description]
	 * @param {[type]} removeClass [description]
	 */
	function addOrRemoveClassToAll(selector, addClass, removeClass) {
		$$(selector).forEach(function(element) {
	        if(typeof addClass !== 'undefined' && addClass.length > 0)
		        element.classList.add(addClass);
	        if(typeof removeClass !== 'undefined' && removeClass.length > 0)
		        element.classList.remove(removeClass);
		});
	}

	/**
	 * добавляет класс COLOR к не выбранным элементам
	 * @param  {[type]} selector [description]
	 * @return {[type]}          [description]
	 */
	function toggleColorClass(selector) {
		$$(selector).forEach(function(element) {
			if(element.checked === false) {
		        // element.parentNode.classList.remove('checked');
		        if(element.value != video['size']) {
			        element.parentNode.classList.add('color');
		        }
		    };
		});
	}

	/**
	 * Функция онклик для кнопок группы А (размеры)
	 */
	$$('.resizer-social-option.stepA input').forEach(function(element) {
		element.addEventListener('click', function(event) {
			// Снимаем выделение с других кнопок размера, они становятся цветными
			// toggleColorClass('.resizer-social-option.stepA input');

	        $('.video-uploaded .resizer-fit-preview').classList.remove('resizer-fit-S','resizer-fit-V','resizer-fit-H','resizer-fit-F');
	        $('.video-uploaded .resizer-fit-preview').classList.add('resizer-fit-'+this.value);
	        resizeFitPreview('resizer-fit-'+this.value);
	        

	        if(!this.parentNode.parentNode.classList.contains('hide')) {
		        addOrRemoveClassToAll('.resizer-social-option.stepA', 'hide');
		        addOrRemoveClassToAll('.resizer-social-option.stepB', '', 'hide');
	        } else {
		        addOrRemoveClassToAll('.resizer-social-option.stepA', '', 'hide');
		        addOrRemoveClassToAll('.resizer-social-option.stepB', 'hide');
	        }

	        switch(video['size']+"_"+this.value) {
	        	case "H_S":
	        	case "H_F":
	        	case "H_V":
	        	case "S_F":
	        	case "S_V":
	        	case "F_V":
	        		// blur
	        		$('.resizer-social-option.stepB input[value="blur"]').click();
	        		break;
	        	case "V_F":
	        	case "V_S":
	        	case "V_H":
	        	case "F_S":
	        	case "F_H":
	        	case "S_H":
		        	// crop
		        	$('.resizer-social-option.stepB input[value="crop"]').click();
	        		break;
	        	default:
	        }
	        this.parentNode.classList.toggle('checked');
	        this.parentNode.classList.toggle('color');
	        this.parentNode.parentNode.classList.toggle('show');

	    });
	});

	/**
	 * Функция онклик для кнопок группы B (эффекты)
	 */
	$$('.resizer-social-option.stepB input').forEach(function(element) {
		element.addEventListener('click', function(event) {

			if(element.value === 'crop') {
				// $('.video-uploaded .resizer-fit-video.first').classList.toggle('cover');
				// $('.video-uploaded .resizer-fit-preview').classList.toggle('bgblack');
				$('.video-uploaded .resizer-fit-video.first').classList.add('cover');
				$('.video-uploaded .resizer-fit-preview').classList.remove('bgblack');
				$('.video-uploaded .resizer-fit-video.second').classList.remove('blur');
				$('.video-uploaded .resizer-fit-video.second').classList.add('hide');
			}
			if(element.value === 'blur') {
				// $('.video-uploaded .resizer-fit-video.second').classList.toggle('blur');
				// $('.video-uploaded .resizer-fit-video.second').classList.toggle('hide');
				$('.video-uploaded .resizer-fit-video.second').classList.add('blur');
				$('.video-uploaded .resizer-fit-video.second').classList.remove('hide');
				if($('.video-uploaded .resizer-fit-video.second').classList.contains('blur')) {
					$('.video-uploaded .resizer-fit-video.second').pause();
					$('.video-uploaded .resizer-fit-video.first').pause();
					$('.video-uploaded .resizer-fit-video.second').currentTime = $('.video-uploaded .resizer-fit-video.first').currentTime;
					$('.video-uploaded .resizer-fit-video.second').play();
					$('.video-uploaded .resizer-fit-video.first').play();
				}
				$('.video-uploaded .resizer-fit-preview').classList.add('bgblack');
				$('.video-uploaded .resizer-fit-video.first').classList.remove('cover');
			}
			if(element.value === 'render') {
				addOrRemoveClassToAll('.resizer-social-option.stepA.show', '', 'show');
				addOrRemoveClassToAll('.resizer-social-option.stepB', 'hide');
				addOrRemoveClassToAll('.resizer-social-option.stepC', '', 'hide');
			} else {
				toggleColorClass('.resizer-social-option.stepB input');
				// this.parentNode.classList.toggle('color');
				this.parentNode.classList.remove('color');
			}

	    });
	});

	/**
	 * Функция онклик для кнопок группы C (результат)
	 */
	$$('.resizer-social-option.stepC input').forEach(function(element) {
		element.addEventListener('click', function(event) {
			// toggleColorClass('.resizer-social-option.stepC input');
			// this.parentNode.classList.toggle('color');

			if(element.value === 'new') {
				addOrRemoveClassToAll('.resizer-social-option.stepA', '', 'hide');
				addOrRemoveClassToAll('.resizer-social-option.stepA label', '', 'checked');
				addOrRemoveClassToAll('.resizer-social-option.stepC', 'hide');
			    $('#dropzone').style.display = '';
			    $('.video-uploaded').style.display = '';
			    // addOrRemoveClassToAll('.resizer-social-option radio-label').classList.remove('color');
				
				dropzoneItem.removeAllFiles();
				$$('.resizer-social-option input').forEach(function(element) {
					if(element.disabled === false) {
						element.disabled = true;
				        // element.parentNode.classList.remove('checked');
				        element.parentNode.classList.remove('color');
				    };
				});
			}
	    });
	});

	/**
	 * Функция подгона превьюхи под размеры устройства
	 * @param  {[type]} fitSizeClass [description]
	 * @return {[type]}              [description]
	 */
	function resizeFitPreview(fitSizeClass) {
		if(fitSizeClass === undefined) {
			var div = $('.video-uploaded .resizer-fit-preview');
			div.classList.remove('resizer-fit-preview', 'video-preview-container', 'bgblack');
			fitSizeClass = div.classList[0];
			div.classList.add('resizer-fit-preview', 'video-preview-container', 'bgblack');
		}
		switch (fitSizeClass) {
        	case "resizer-fit-S":
        		$('.video-uploaded .'+fitSizeClass).style.height = $('.video-uploaded .'+fitSizeClass).getBoundingClientRect().width+'px';
        		break;
        	case "resizer-fit-V":
        		$('.video-uploaded .'+fitSizeClass).style.height = $('.video-uploaded .'+fitSizeClass).getBoundingClientRect().width/9*16+'px';
        		break;
        	case "resizer-fit-H":
        		$('.video-uploaded .'+fitSizeClass).style.height = $('.video-uploaded .'+fitSizeClass).getBoundingClientRect().width/16*9+'px';
        		break;
        	case "resizer-fit-F":
        		$('.video-uploaded .'+fitSizeClass).style.height = $('.video-uploaded .'+fitSizeClass).getBoundingClientRect().width/4*5+'px';
        		break;
        	default:
        }
	}



	/**
	 * Настройки для области захвата файлов
	 */
	
	Dropzone.autoDiscover = false;

	var dropzoneItem = new Dropzone('#video_upload', {
	  previewTemplate: $('#preview-template').innerHTML,
	  parallelUploads: 1,
	  uploadMultiple: false,
	  maxFiles: 1,
	  maxFilesize: 500,
	  thumbnailHeight: 120,
	  thumbnailWidth: 120,
	  filesizeBase: 1000,
	  acceptedFiles: '.mp4',
	  
	  renameFile: function(file) {
	  	return Date.now() + '_' + file.name;
	  },

	  init: function () {
		this.on("error", function(file) {
		    console.error("smth error w " + file.name);
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
		this.on("success", function(file, response) {
		    // alert("complete");
		    $('#dropzone').style.display = 'none';
		    $('.video-uploaded').style.display = 'initial';

		    // console.log([file, response]);

		    video['src'] = '';

		    if(response.success) {
		    	video['src'] = response.file;
		    	video['size'] = response.R;
		    } else {
		    	if(parseInt(sessionStorage.numVideo) < videos.length-1) {
			    	sessionStorage.setItem('numVideo', parseInt(sessionStorage.numVideo)+1);
			    } else {
			    	sessionStorage.setItem('numVideo', 0);
			    }
		    	video['src'] = videos[sessionStorage.numVideo].file;
		    	video['size'] = videos[sessionStorage.numVideo].R;
			}
		    var divVideo = '<video class="resizer-fit-video" muted loop="" autoplay="" preload="auto" playsinline="" style="">\
					<source src="'+video['src']+'" type="video/mp4" />\
				</video>';
			$('.video-uploaded .resizer-fit-preview').innerHTML = divVideo;
			$('.video-uploaded .resizer-fit-preview').innerHTML += divVideo;
			$('.video-uploaded .resizer-fit-preview').classList.add('resizer-fit-'+video['size']);
			$$('.video-uploaded .resizer-fit-video')[0].classList.add('first');
			$$('.video-uploaded .resizer-fit-video')[1].classList.add('second', 'hide');
		    resizeFitPreview('resizer-fit-'+video['size']);
		    
		    $$('.resizer-social-option input:disabled').forEach(function(element) {
				if(element.disabled === true) {
			        if(element.value != video['size']) {
						element.disabled = false;
				        // element.parentNode.classList.remove('checked');
				        element.parentNode.classList.add('color');
			        }
			    };
			});
		});
	  }

	});

    if(location.hostname != 'localhost') {
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
	}

});
