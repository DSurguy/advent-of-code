import defaultCompare from './compare';

type comparator<T> = (a: T, b: T) => 1 | -1 | 0;

/**
 * Execute a binary search to insert a new item into an existing list
 *  using an optional comparison function
 * 
 * When an exact match comes out of the comparison, the new item is 
 *  added at the end of the section of matching items
 */
export function sortedInsert<T = any>(list: T[], newItem: T, externalCompare: comparator<T> = defaultCompare ){
  const compare = externalCompare || defaultCompare;

  if( !list.length ){
    list.push(newItem);
    return;
  }

  let mid = Math.floor(list.length/2);
  let left = 0;
  let right = list.length-1;
  while( true ){
    if( left >= right ){
      if( compare(list[left], newItem) === 1 ){
        list.splice(left, 0, newItem);
        return;
      }
      else{
        list.splice(left+1, 0, newItem);
        return;
      }
    }
    const result = compare(list[mid], newItem)
    if( result === 0 ){
      //exact match, crawl until we don't match anymore
      for( let i=mid; i<list.length; i++ ){
        if( compare(list[i+1], newItem) !== 0 ){
          list.splice(i+1,0,newItem)
          return;
        }
      }
    }
    else if( result === -1 ) {
      //the list item at mid was smaller, so we shift left
      left = mid + 1;
    }
    else {
      //the list item at mid was larger, so we shift right
      right = mid - 1;
    }
    mid = Math.floor((left+right)/2)
  }

}