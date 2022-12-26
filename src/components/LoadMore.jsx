export default function LoadMore({offset, updateOffset}) {
	return(
		offset < 550 &&
			<button className='btn btn-primary load-more' onClick={() => updateOffset()}>
				Mehr laden
			</button>
	)
}