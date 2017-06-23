
class OpengraphRenderer {
	constructor(opengraph) {
		this.opengraph = opengraph
	}

	render() {
		const { mediaUrl } = this.opengraph
		if (mediaUrl) {
			return this.renderMedia()
		} else {
			return this.renderSummary()
		}
	}

	renderMedia() {
		const { mediaUrl, url } = this.opengraph
		return `<iframe src="${mediaUrl}" data-opengraph-url="${url}" width="560" height="315" frameborder="0" allowfullscreen></iframe>`
	}

	renderSummary() {
		const { image, title, description, host, url } = this.opengraph
		let body = ''
		body = ''
		if (image) {
			body += `<div style="width:470px; height:235px; overflow:hidden">
				<a href="${url}"><img style="width:470px" src="${image}"></a>
			</div>`
		}
		body += `<div style="width:470px; padding:10px; box-sizing:border-box">
			<a href="${url}" style="display:block; font-weight:500; font-size:18px; overflow: hidden; word-wrap: break-word; line-height:25px; text-overflow: ellipsis; white-space:nowrap; color:#666; text-decoration:none">${title}</a>
			<div style="font-size:12px; line-height:18px; height:36px; white-space: normal;-webkit-line-clamp: 2; -webkit-box-orient: vertical; text-overflow: ellipsis; display: -webkit-box; overflow:hidden; color:#666">${description}</div>
			<div style="font-size:11px; color:#999; line-height:14px">${host}</div>
		</div>`
		return `<div style="position:relative; width:470px; box-shadow:0 1px 5px #999; margin: 10px auto"
			data-oepngraph-image="${image}" data-opengraph-title="${title}"
			data-opengraph-description="${description}" data-opengraph-host="${host}"
			data-opengraph-url="${url}">
			${body}
		</div>`
	}
}

export default OpengraphRenderer
