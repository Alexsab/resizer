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

	var env = 'dev2';
	var serviceToken = "";

	// deleteCookie('serviceToken');
	// localStorage.getItem('serviceToken')
	// localStorage.setItem('serviceToken', '123')
	
	if((serviceToken = getCookie('serviceToken')).length > 15) {
		console.log('You use token: ' + serviceToken);
	} else {
		serviceToken = prompt("Please enter service token:", "gobbledygook"); 
		setCookie('serviceToken',serviceToken);
	}
	if (serviceToken == null || serviceToken == "") { 
		console.warn("User cancelled serviceToken, start example mode."); 
	}
	
	/* * /
	var $ = function(name) { 
		if( document.querySelector(name) !== null ) {
			if( document.querySelectorAll(name).length > 1 ) {
				return document.querySelectorAll(name);
			}
			return document.querySelector(name);
		}
		return null;
	}
	/**/

	var $ = function(name) { return document.querySelector(name) }
	var $$ = function(name) { return document.querySelectorAll(name) }

	document.querySelectorAll('.resizer-social-option.stepA.show')
	document.querySelector('.resizer-social-option.stepA.show')

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
		        element.parentNode.classList.add('color');
		    };
		});
	}

	/**
	 * Функция онклик для кнопок группы А (размеры)
	 */
	$$('.resizer-social-option.stepA input').forEach(function(element) {
		element.addEventListener('click', function(event) {
			// Снимаем выделение с других кнопок размера, они становятся цветными
			toggleColorClass('.resizer-social-option.stepA input');

	        $('.video-uploaded .resizer-fit-preview').classList.remove('resizer-fit-11','resizer-fit-916','resizer-fit-169','resizer-fit-45');
	        $('.video-uploaded .resizer-fit-preview').classList.add('resizer-fit-'+this.value);
	        
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

	/**
	 * Функция онклик для кнопок группы B (эффекты)
	 */
	$$('.resizer-social-option.stepB input').forEach(function(element) {
		element.addEventListener('click', function(event) {

			if(element.value === 'crop') {
				$('.video-uploaded .resizer-fit-video.first').classList.toggle('cover');
				$('.video-uploaded .resizer-fit-preview').classList.toggle('bgblack');
				$('.video-uploaded .resizer-fit-video.second').classList.remove('blur');
				$('.video-uploaded .resizer-fit-video.second').classList.add('hide');
			}
			if(element.value === 'blur') {
				$('.video-uploaded .resizer-fit-video.second').classList.toggle('blur');
				$('.video-uploaded .resizer-fit-video.second').classList.toggle('hide');
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
				this.parentNode.classList.toggle('color');
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
			div.classList.remove('resizer-fit-preview', 'video-preview-container');
			fitSizeClass = div.classList[0];
			div.classList.add('resizer-fit-preview', 'video-preview-container');
		}

		switch (fitSizeClass) {
        	case "resizer-fit-11":
        		$('.video-uploaded .'+fitSizeClass).style.height = $('.video-uploaded .'+fitSizeClass).getBoundingClientRect().width+'px';
        		break;
        	case "resizer-fit-916":
        		$('.video-uploaded .'+fitSizeClass).style.height = $('.video-uploaded .'+fitSizeClass).getBoundingClientRect().width/9*16+'px';
        		break;
        	case "resizer-fit-169":
        		$('.video-uploaded .'+fitSizeClass).style.height = $('.video-uploaded .'+fitSizeClass).getBoundingClientRect().width/16*9+'px';
        		break;
        	case "resizer-fit-45":
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
		    $('#dropzone').style.display = 'none';
		    $('.video-uploaded').style.display = 'initial';

		    var videos = [
		    	'uploads/thanosMovie.mp4', 
		    	'uploads/1x1.mp4', 
		    	'uploads/916.mp4', 
		    	'uploads/4x5.mp4'
		    ];
		    if(location.hostname == 'localhost') {
		    	videos = [
		    		'uploads/thanosMovie.mp4', 
		    		'uploads/1x1.mp4', 
		    		'uploads/916.mp4', 
		    		'uploads/4x5.mp4'
		    	];
		    }
		    if(parseInt(sessionStorage.numVideo) < videos.length-1) {
		    	sessionStorage.setItem('numVideo', parseInt(sessionStorage.numVideo)+1);
		    } else {
		    	sessionStorage.setItem('numVideo', 0);
		    }
		    var divVideo = '<video class="resizer-fit-video" muted loop="" autoplay="" preload="auto" playsinline="" style="">\
					<source src="'+videos[sessionStorage.numVideo]+'" type="video/mp4" />\
				</video>';
			$('.video-uploaded  .resizer-fit-preview').innerHTML = divVideo;
			$('.video-uploaded  .resizer-fit-preview').innerHTML += divVideo;
			$$('.video-uploaded  .resizer-fit-video')[0].classList.add('first');
			$$('.video-uploaded  .resizer-fit-video')[1].classList.add('second', 'hide');
		    resizeFitPreview();
		    
		    $$('.resizer-social-option input:disabled').forEach(function(element) {
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
