export default function LoadMore({offset, updateOffset}) {
    return(
        offset < 450 && 
          <button className='btn btn-primary load-more' onClick={() => updateOffset()}>
            Mehr laden
          </button>
    )
}