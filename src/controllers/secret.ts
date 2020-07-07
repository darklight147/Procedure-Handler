import {Request, Response, Router} from 'express';
import AWS from 'aws-sdk';
import fs from 'fs';
import webp from 'webp-converter';
import lodash from 'lodash';
import axios from 'axios';
import request from 'request';
import client from '../discord/app';
import SEND from "../discord/sender";
const router = Router();

// model
import Game from '../models/game';
import { Error, Document } from 'mongoose';

const download = (
	uri: string,
	filename: string,
	callback: () => void
) => {
	try {
		request.head(uri, () => {
			request(uri)
				.pipe(fs.createWriteStream(__dirname + '/' + filename))
				.on('close', callback)
				.on('error', (e) => console.log(e));
		});
	} catch (error) {
		console.log(error);
	}
};
// router.use(Logger);
router.post('/secret', (e: Request, r: Response) => {
	if (1) {
		AWS.config.region = 'eu-north-1';
		const s3 = new AWS.S3({
			accessKeyId: 'AWS_S3_KEY',
			secretAccessKey: 'AWS_S3_ACCESS_KEY',
		});
		// tslint:disable-next-line: one-variable-per-declaration
		const {
				title: s,
				size: t,
				NumberofFiles: o,
				magnetLink: n,
				review: a,
				Genre: i,
				Thumbnail: p,
				background: l,
				trailer: g,
				money_link: zz,
			} = e.body,
      m = 'https://www.youtube.com/embed/' + g.slice(32, g.lenght);
      interface IDocument extends Document {
        money_link?: string
        money_linklol?: string
        backgroundimgthumbnail?: string
        thumbnail?: string
        backgroundimg?: string
      }
		const newG: IDocument = new Game({
			title: lodash.toUpper(s).trim(),
			size: lodash.toLower(t),
			files: lodash.toLower(o),
			magnetlink: n.trim(),
			review: a,
			genre: i,
			thumbnail: p,
			backgroundimg: l,
			trailerlink: m,
			kebabTitle: lodash.kebabCase(s),
		});
		r.sendStatus(204);
		function sleep(ms: number) {
			return new Promise((resolve) => setTimeout(resolve, ms));
		}
		download(p, lodash.kebabCase(s), () => {
			console.log('got here');
			webp.cwebp(
				__dirname + '/' + lodash.kebabCase(s),
				__dirname + '/' + lodash.kebabCase(s) + '.webp',
				'-q 80',
				(status: any, error: any) => {
					console.log(status, error);
					fs.readFile(
						__dirname + '/' + lodash.kebabCase(s) + '.webp',
						(err, buffer) => {
							if (err) {
								throw err;
							}
							s3.upload(
								{
									Bucket: 'YOU_BUCKET_NAME',
									Key: lodash.kebabCase(s) + '.webp',
									ACL: 'public-read',
									Body: buffer,
									CacheControl: 'max-age=2592000',
								},
								// tslint:disable-next-line: no-shadowed-variable
								async (err: Error, data) => {
									if (err) {
										console.log(err);
									} else {
										newG.thumbnail = data.Location;
										await newG.save();
										download(l, lodash.kebabCase(s), () => {
											webp.cwebp(
												__dirname + '/' + lodash.kebabCase(s),
												__dirname + '/' + lodash.kebabCase(s) + '-back.webp',
												'-q 80',
												() => {
													fs.readFile(
														__dirname +
															'/' +
															lodash.kebabCase(s) +
															'-back.webp',
														// tslint:disable-next-line: no-shadowed-variable
														(_err: Error, buffer: Buffer) => {
															s3.upload(
																{
																	Bucket: 'YOU_BUCKET_NAME',
																	Key: lodash.kebabCase(s) + '-back.webp',
																	ACL: 'public-read',
																	Body: buffer,
																	CacheControl: 'max-age=2592000',
																},
																// tslint:disable-next-line: no-shadowed-variable
																async (err: Error, data: AWS.S3.ManagedUpload.SendData) => {
																	if (err) {
																		console.log(err);
																	} else {
																		newG.backgroundimg = data.Location;
																		await axios
																			.get(
																				'https://smoner.com/api?api=SMONER_API_KEY&url=' +
																					encodeURI(zz.trim())
																			)
																			.then(async (res) => {
																				newG.money_linklol =
																					res.data.shortenedUrl;
																				await newG.save();
																			});
																		await axios
																			.get(
																				'https://linkjust.com/api?api=SMONER_API_KEY&url=' +
																					encodeURI(zz.trim())
																			)
																			.then(async (res) => {
																				newG.money_link = res.data.shortenedUrl;
																				await newG.save();
																			});
																		fs.unlink(
																			__dirname +
																				'/' +
																				lodash.kebabCase(s) +
																				'-back.webp',
																			() => {
																				fs.unlink(
																					__dirname +
																						'/' +
																						lodash.kebabCase(s) +
																						'.webp',
																					() => {
																						try {
																							fs.unlink(
																								__dirname +
																									'/' +
																									lodash.kebabCase(s),
																								async () => {
																									console.log('deleted');
																									// emitting message to discord
																									try {
																										// const response = await axios.post(
																										//   'http://shortener/api/shorten',
																										//   qs.stringify({
																										//     longUri: `https://game-linter.com/game/${lodash.kebabCase(s)}`,
																										//   })
																										// );
																										SEND(
																											client,
																											`https://game-linter.com/game/${lodash.kebabCase(
																												s
																											)}`
																										);
																									} catch (error) {
																										console.error(
																											`error sending to discord`
																										);
																										console.log(error);
																									}
																								}
																							);
																						} catch (error) {
																							console.log(error);
																						}
																					}
																				);
																			}
																		);
																	}
																}
															);
														}
													);
												}
											);
										});
									}
								}
							);
						}
					);
				}
			);
		});
	}
});

export default router;
