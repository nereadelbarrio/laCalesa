(function (blink) {
	'use strict';

	var laCalesaStyle = function () {
			blink.theme.styles.basic.apply(this, arguments);
		},
		page = blink.currentPage;

	laCalesaStyle.prototype = {
		//BK-15873 añadimos el estilo basic como parent para la herencia de los estilos del CKEditor
		parent: blink.theme.styles.basic.prototype,
		bodyClassName: 'content_type_clase_laCalesa',
		extraPlugins: ['image2'],
		ckEditorStyles: {
			name: 'laCalesa',
			styles: [

				{ name: 'Título 1', element: 'h4', attributes: { 'class': 'bck-title1'} },
				{ name: 'Título 2', element: 'h4', attributes: { 'class': 'bck-title2'} },
				{ name: 'Título 3', element: 'h4', attributes: { 'class': 'bck-title3'} },

				{ name: 'Énfasis', element: 'span', attributes: { 'class': 'bck-enfasis-1' }},
				{ name: 'Segoe print', element: 'span', attributes: { 'class': 'bck-enfasis-2' }},
				{ name: 'My font', element: 'span', attributes: { 'class': 'bck-enfasis-3' }},
				{ name: 'Barmeo', element: 'span', attributes: { 'class': 'bck-enfasis-4' }},
				{ name: 'Enunciado actividad', element: 'h4', attributes: { 'class': 'bck-title-activity' }},

				{ name: 'Lista des 1', element: 'ul', attributes: { 'class': 'bck-ul-1'} },

				{ name: 'Lista ord 1', element: 'ol', attributes: { 'class': 'bck-ol-1' } },

				{ name: 'Tabla centrada', element: 'table', type: 'bck-stack-class', attributes: { 'class': 'bck-table-center'} },
				{ name: 'Celda encabezado', element: 'td', attributes: { 'class': 'bck-td' } },

				{ name: 'Caja 1', type: 'widget', widget: 'blink_box', attributes: { 'class': 'box-1' } },
				{ name: 'Caja 2', type: 'widget', widget: 'blink_box', attributes: { 'class': 'box-2' } },
				{ name: 'Caja 3', type: 'widget', widget: 'blink_box', attributes: { 'class': 'box-3' } },
				{ name: 'Caja 4', type: 'widget', widget: 'blink_box', attributes: { 'class': 'box-4' } },
				{ name: 'Caja 5', type: 'widget', widget: 'blink_box', attributes: { 'class': 'box-5' } },
				{ name: 'Caja 6', type: 'widget', widget: 'blink_box', attributes: { 'class': 'box-6' } },
				{ name: 'Caja 7', type: 'widget', widget: 'blink_box', attributes: { 'class': 'box-7' } },
				{ name: 'Caja 8', type: 'widget', widget: 'blink_box', attributes: { 'class': 'box-8' } }
			]
		},

		init: function (scope) {
			var that = scope || this
			//BK-15873 Utilizamos this.parent declarada al inicio de la clase
			this.parent.init.call(that);
			that.addActivityTitle();
			if(window.esWeb) return;
			that.addPageNumber();
			that.formatCarouselindicators();
			that.addSlideNavigators();
		},

		removeFinalSlide: function (scope) {
			//BK-15873 Utilizamos this.parent declarada al inicio de la clase
			var that = scope || this
			this.parent.removeFinalSlide.call(that, true);
		},

		addActivityTitle: function () {
			if (!blink.courseInfo || !blink.courseInfo.unit) return;
			$('.libro-left').find('.title').html(function () {
				return $(this).html() + ' > ' + blink.courseInfo.unit;
			})
		},

		addPageNumber: function() {
			$('.js-slider-item').each(function(i,e) {
				var idPage = $(e).attr('id');
				var page = parseInt(idPage.replace("slider-item-", ""))+1;
				$(e).find('.header').prepend('<div class="single-pagination"><div class="page">'+page+'</div></div>');
			});
		},


		formatCarouselindicators: function () {
			var $navbarBottom = $('.navbar-bottom'),
				$carouselIndicators = $('.slider-indicators').find('li');
			$navbarBottom.find('li').tooltip('destroy');

			var dropDown = '' +
					'<div class="dropdown">' +
						'<button id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">' +
							'Índice' +
							'<span class="caret"></span>' +
						'</button>' +
						'<ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">';

			var navigatorIndex = 0;
			for (var index = 0; index < window.secuencia.length; index++) {
				var slide = eval('t'+index+'_slide'),
					slideTitle = slide.title;

				if (slide.isConcatenate) continue;

				dropDown += '<li role="presentation"><a role="menuitem">' + (navigatorIndex+1) + '. ' + stripHTML(slideTitle) + '</a></li>';
				$navbarBottom.find('li').eq(navigatorIndex).html('<span title="'+ stripHTML(slideTitle) +'">'+(navigatorIndex+1)+'</span>');
				navigatorIndex++;

			};

			dropDown += '' +
						'</ul>' +
					'</div>';

			//BK-18572 Ajustar estilo en UX
			var tmpux = '';
			blink.hasOwnProperty('checkFromUX') && blink.checkFromUX(function() { tmpux = ' tmpux'});

			$navbarBottom
				.attr('class', 'publisher-navbar'+tmpux)
				.wrapInner('<div class="navbar-content"></div>')
				.find('ol')
					.before(dropDown)
					.wrap('<div id="top-navigator"/>')
					.end()
				.find('.dropdown').find('li')
					.on('click', function (event) {
						$navbarBottom.find('ol').find('li').eq($(this).index()).trigger('click');
					});

			if (!blink.hasTouch) {
				$navbarBottom
					.find('ol').find('span')
						.tooltip({
							placement: 'bottom',
							container: 'body'
						});
			}
		},

		//BK-15873 Quitamos la funcion getEditorStyles para que herede de parent
	};

	laCalesaStyle.prototype = _.extend({}, new blink.theme.styles.basic(), laCalesaStyle.prototype);

	blink.theme.styles.laCalesa = laCalesaStyle;

})( blink );

$(document).ready(function () {

    $('.item').find('.header').find('.title')
		.filter(function () {
			return $(this).find('.empty').length;
		}).hideBlink();

    $('.item').find('.header').find('.title')
		.filter(function () {
			return !$(this).find('.empty').length;
		})
		.each(function () {
			var $header = $(this).find('h3');
			$header.length && $header.html($header.html().replace(' ', ''));
		});

	// BK-8433 cambiamos el logo de las slides por el del dominio
	var src_logo = $('.content_type_clase_laCalesa').find('.logo_slide').attr('logo_dominio');
	if (typeof(src_logo) != 'undefined' && src_logo && src_logo != '' && src_logo.indexOf('gif1x1.gif') == -1) {
		$('.content_type_clase_laCalesa').find('.logo-publisher').css('background-image', "url('"+src_logo+"')");
	}

});
