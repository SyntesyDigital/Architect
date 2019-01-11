/*
 * Image Uploader  v1.0
 *
 * Copyright 2017, Syntesy Digital SC
 */
Dropzone.autoDiscover = false;

(function($) {

	function ImageUploader(element, options) {
		this.root = $(element);

		var self = this;

		this.settings = $.extend({}, $.fn.imageUploader.defaults, options);

		if(this.settings.csrf_token == null || this.settings.csrf_token == ''){
			console.error("jquery.imageUploader :: CSRF Token is necessary");
		}

		if(this.root.attr("id") == ""){
			console.error("jquery.imageUploader :: attribute id is necessary");
		}

		$(document).on('click','#'+this.root.attr("id")+' #remove-picture',function(event){

			event.preventDefault();

			self.reset();
		});

		$(this.settings.submitForm).click(function(e) {

			e.preventDefault();

			if(self.root.find("#uploading").length > 0 && self.root.find("#uploading").val() == 1){
				toastr.error('Image is uploading, please wait upload is complete', 'Erreur !', {timeOut: 3000});
			}
			else {
				//submit form
				$(self.settings.submitForm).closest("form").submit();
			}
		});

		this.init();
	}

	ImageUploader.prototype = {

		init : function() {

			var self = this;

			var imageDropzone = new Dropzone('#'+this.root.attr("id")+" #image-dropzone",{
				uploadMultiple: false,
			    parallelUploads: 1,
			    maxFilesize: 2,
				url : self.settings.uploadUrl,
				sending: function(file, xhr, formData) {
				    formData.append("_token", self.settings.csrf_token);
				    formData.append("resizeWidth", self.settings.resizeWidth);
				},
				uploadprogress : function(file,progress){
			    	//console.log(file);
			    	//console.log(progress);

			    	//console.log("progress : "+progress);
			    	self.root.find("#uploading").val(1);
			    	self.root.find(".dropzone-container .message").css({opacity:0});

			    	self.root.find(".progress-bar").css({
			    		display:"block",
			    		width:progress+"%"
			    	});

			    },
			    error: function(file, response) {

					if(response.message == undefined) {
						toastr.error(response, 'Erreur !', {timeOut: 3000});
					} else {
						toastr.error(response.message, 'Erreur !', {timeOut: 3000});
					}
					this.removeAllFiles();
			        self.reset();

			        self.root.find("#uploading").val(0);
			    },
			    success: function(file,done) {

			        //enable

			        self.root.find("#image").val(done.filename);

			        self.root.find(".image-container.uploaded .background-image").css({
			        	backgroundImage : "url("+done.storage_filename+")",
			        });

			        self.root.find(".image-container.uploaded").css({display:'block'});
					self.root.find(".dropzone-container").css({display:'none'});
					self.root.find("#uploading").val(0);
			    }
			});
		},

		reset : function() {

			this.root.find(".image-container.uploaded").css({display:'none'});
	        this.root.find(".dropzone-container").css({display:'block'});
	        this.root.find(".dropzone-container .message").css({opacity:1});
	        this.root.find(".dropzone-container .progress-bar").css({display:"none"});

			this.root.find("#image").val(null);
		}

	}; /* ImageUploader.prototype end */

	$.fn.imageUploader = function(options) {
		return this.each(function(){
			var imageUploader = new ImageUploader($(this), options);
			$(this).data("imageUploader", imageUploader);
		});
	};

	$.fn.imageUploader.defaults = {
		//define defaults
		resizeWidth : null,
		submitForm : 'input[type="submit"]',
		csrf_token : null,
		uploadUrl : '/file/upload'
	};

	$.fn.imageUploader.settings = {};

})(jQuery);
