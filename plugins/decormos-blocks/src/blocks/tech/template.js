import floorImageUrl from '../../assets/tech/floor.webp';
import floorMobileImageUrl from '../../assets/tech/floor-mobile.webp';
import wallImageUrl from '../../assets/tech/wall.webp';
import wallMobileImageUrl from '../../assets/tech/wall-mobile.webp';

const FLOOR_CAPTION = 'Схема нанесения слоев на пол';
const FLOOR_LIST = [
	'2 слоя полиуретанового лака / 3 слоя мастики',
	'2 слоя полиуретанового грунта / 2 слоя грунта',
	'1 слой микроцемента',
	'2 слоя микробетона (может быть финишным покрытием)',
	'1 слой акрилового грунта',
	'Основание: бетон/ полусухая стяжка / стяжка / наливной пол / плитка / ЦСП',
];

const WALL_CAPTION = 'Схема нанесения слоев на стены';
const WALL_LIST = [
	'Основание: ЦСП / плитка / гипсовая и цементная штукатурка и шпаклевки / гипсокартон / ГВЛ / бетон / фанера / ОСП',
	'1 слой акрилового грунта',
	'1-2 слоя микробетона (может быть финишным покрытием)',
	'1-2 слоя микроцемента (в зависимости от желаемого результата)',
	'Пропитка полуматовая или другие матовые / глянцевые лаки / мастика',
];

function TechFloor() {
	return (
		<div className="tech__box tech__box--right">
			<figure className="tech__figure">
				<svg
					className="tech__svg d-none d-md-block"
					viewBox="0 0 1150 468"
					preserveAspectRatio="xMidYMid meet"
					role="img"
					aria-label={ FLOOR_CAPTION }
				>
					<image
						href={ floorImageUrl }
						x="395"
						y="0"
						width="755"
						height="468"
					/>
					<g className="lines" transform="translate(10 25)">
						<g className="callout-branch">
							<polyline points="0,34 680,34 725,95" fill="none" className="callout" />
							<polyline points="680,34 780,70" fill="none" className="callout" />
						</g>
						<g className="callout-branch">
							<polyline points="0,74 600,74 630,120" fill="none" className="callout" />
							<polyline points="600,74 680,100" fill="none" className="callout" />
						</g>
						<polyline points="0,118 560,118 602,150" fill="none" className="callout" />
						<g className="callout-branch">
							<polyline points="0,182 500,182 550,162" fill="none" className="callout" />
							<polyline points="500,182 530,190" fill="none" className="callout" />
						</g>
						<polyline points="0,222 520,222" fill="none" className="callout" />
						<polyline points="0,284 540,284" fill="none" className="callout" />
					</g>
					<g className="labels" transform="translate(0 15)">
						<text x="20" y="38" className="label">2 слоя полиуретанового лака / 3 слоя мастики</text>
						<text x="20" y="78" className="label">2 слоя полиуретанового грунта / 2 слоя грунта</text>
						<text x="20" y="118" className="label">1 слой микроцемента</text>
						<text x="20" y="158" className="label">2 слоя микробетона</text>
						<text x="20" y="182" className="label">(может быть финишным покрытием)</text>
						<text x="20" y="222" className="label">1 слой акрилового грунта</text>
						<text x="20" y="262" className="label">Основание: бетон / полусухая стяжка / </text>
						<text x="20" y="284" className="label">стяжка / наливной пол / плитка / ЦСП</text>
					</g>
				</svg>

				<img
					src={ floorMobileImageUrl }
					alt=""
					className="tech__image d-block d-md-none"
				/>

				<figcaption className="tech__figcaption">{ FLOOR_CAPTION }</figcaption>
				<ul className="tech__list">
					{ FLOOR_LIST.map( ( item ) => (
						<li key={ item }>{ item }</li>
					) ) }
				</ul>
			</figure>
		</div>
	);
}

function TechWall() {
	return (
		<div className="tech__box tech__box--left">
			<figure className="tech__figure">
				<svg
					className="tech__svg d-none d-md-block"
					viewBox="0 0 1150 693"
					preserveAspectRatio="xMidYMid meet"
					role="img"
					aria-label={ WALL_CAPTION }
				>
					<image href={ wallImageUrl } x="0" y="0" width="597" height="693" />

					<g className="lines" transform="translate(0 70)">
						<g className="callout-branch">
							<polyline points="1150,60 430,60" fill="none" className="callout" />
							<polyline points="1149,60 550,60 490,40" fill="none" className="callout" />
							<polyline points="1149,60 550,60 450,45" fill="none" className="callout" />
						</g>
						<polyline points="1149,120 400,120" fill="none" className="callout" />
						<polyline points="1149,180 380,180" fill="none" className="callout" />
						<polyline points="1149,240 335,240" fill="none" className="callout" />
						<polyline points="1149,300 250,300" fill="none" className="callout" />
					</g>
					<g className="labels" transform="translate(1150 60)">
						<text x="0" y="40" className="label">Основание: ЦСП / плитка / гипсовая и цементная штукатурка и</text>
						<text x="0" y="60" className="label">шпаклевки / гипсокартон / ГВЛ / бетон / фанера / ОСП</text>
						<text x="0" y="120" className="label">1 слой акрилового грунта</text>
						<text x="0" y="180" className="label">1-2 слоя микробетона (может быть финишным покрытием)</text>
						<text x="0" y="240" className="label">1-2 слоя микроцемента (в зависимости от желаемого результата)</text>
						<text x="0" y="280" className="label">Пропитка полуматовая или другие матовые / </text>
						<text x="0" y="300" className="label">глянцевые лаки / мастика</text>
					</g>
				</svg>

				<img
					src={ wallMobileImageUrl }
					alt=""
					className="tech__image d-block d-md-none"
				/>

				<figcaption className="tech__figcaption">{ WALL_CAPTION }</figcaption>
				<ul className="tech__list">
					{ WALL_LIST.map( ( item ) => (
						<li key={ item }>{ item }</li>
					) ) }
				</ul>
			</figure>
		</div>
	);
}

export default function TechMarkup( { type = 'both' } ) {
	const showFloor = type !== 'wall';
	const showWall = type !== 'floor';

	return (
		<>
			{ showFloor ? <TechFloor /> : null }
			{ showWall ? <TechWall /> : null }
		</>
	);
}
