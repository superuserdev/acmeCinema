import './std-js/shims.js';
import './std-js/deprefixer.js';
import {$, ready, waitUntil, registerServiceWorker} from './std-js/functions.js';
import {alert} from './std-js/asyncDialog.js';
import * as Mutations from './std-js/mutations.js';
import webShareApi from './std-js/webShareApi.js';
import {
	facebook,
	twitter,
	googlePlus,
	linkedIn,
	reddit,
	gmail,
	email,
} from './std-js/share-config.js';

webShareApi(facebook, twitter, googlePlus, linkedIn, reddit, gmail, email);

ready().then(async () =>{
	if (navigator.share instanceof Function) {
		$('[data-share]').attr({hidden: false});
	}
	const $doc = $(document.documentElement);
	$doc.replaceClass('no-js', 'js');
	$doc.watch(Mutations.events, Mutations.options, Mutations.filter);
	Mutations.init();

	if (document.documentElement.hasOwnProperty('serviceWorker')) {
		registerServiceWorker(document.documentElement.dataset.serviceWorker);
	}

	$('[data-service-worker]').each(el => registerServiceWorker(el.dataset.serviceWorker));

	$('.trailer-dialog').on('close', event => {
		const iframe = event.target.querySelector('iframe');
		if (iframe instanceof HTMLElement) {
			iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
		}
	});

	$('[data-show-trailer]').click(async (event) => {
		const template = document.getElementById('trailer-dialog-template').content.cloneNode(true);
		const dialog = template.querySelector('dialog');
		const iframe = template.querySelector('iframe');
		const src = new URL(`/embed/${event.target.closest('[data-show-trailer]').dataset.showTrailer}`, 'https://www.youtube-nocookie.com');
		event.target.disabled = true;
		iframe.src = src;
		dialog.addEventListener('close', event => event.target.remove());
		$('button', template).click(() => dialog.close());
		document.body.append(template);
		await waitUntil(iframe, 'load');
		dialog.showModal();
		event.target.disabled = false;
	});

	$('.showtime').click(() => alert('Purchasing tickets not implemented. Please call for purchases and info.'));
});
