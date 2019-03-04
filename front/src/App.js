import React, { PureComponent } from "react";
import SocketIOClient from 'socket.io-client';

import { SOCKET_HOST, SOCKET_PORT } from './helper/Config';
import 'bootstrap/dist/css/bootstrap.min.css';

import VideoBox from "./components/VideoBox";
import VideoList from "./components/VideoList";
import "./App.css";

export default class extends PureComponent {

	constructor() {
		super();
		this.state = {
			freshVideos: [],
			currentVideo: { name: null, file: null },
			currentVideoIndex: -1,
			controls: {
				autoPlay: true,
				loopOne: false,
				loopAll: true,
				isEnded: true
			}
		};
	}

	componentDidMount() {
		this.socket = SocketIOClient(SOCKET_HOST + ':' + SOCKET_PORT);
		this.socket.emit('videos', {});
		this.socket.on('videos', (data) => {
			// console.log(data.videos);
			this.setState({ freshVideos: data.videos });
			if (this.state.freshVideos.length && this.state.controls.loopAll) {
				this.setState({ currentVideoIndex: 0 });
				// if (this.state.controls.isEnded) {
				this.selectVideo(this.state.freshVideos[this.state.currentVideoIndex]);
				// }
			} else {
				this.setState({ currentVideo: { name: null, file: null } });
			}
		});
	}

	render() {
		return (
			<main role="main">
				<div className="album py-5 bg-light">
					<div className="container">
						<div className="row">
							<div className="col-md-8">
								<VideoBox
									src={this.state.currentVideo.file}
									autoPlay={this.state.controls.autoPlay}
									onEnded={this.onVideoEnd}
									data={this.state.currentVideo}
								/>
							</div>

							<div className="col-md-4">
								<VideoList dataArray={this.state.freshVideos} onPress={(file) => this.selectVideo(file)} />
							</div>
						</div>
					</div>
				</div>
			</main>
		);
	}

	selectVideo = (currentVideo) => {
		this.setState({ currentVideo });
		this.updateControls({ isEnded: false });
	};

	updateControls = (controls) => {
		let oldControls = Object.assign({}, this.state.controls);
		for (let key in controls) {
			let val = controls[key];
			oldControls[key] = val;
		}
		this.setState({ controls: oldControls });
	};

	onVideoEnd = () => {
		this.updateControls({ isEnded: true });
		if (this.state.controls.loopOne) {
			this.updateControls({ loopAll: false });
		} else {
			// this.updateControls({ loopAll: false });
		}

		let nextIndex = 0;

		if (this.state.controls.loopAll && this.state.freshVideos[this.state.currentVideoIndex + 1]) {
			nextIndex = this.state.currentVideoIndex + 1;
		}

		this.setState({ currentVideoIndex: nextIndex });

		this.selectVideo(this.state.freshVideos[nextIndex]);
	};


}