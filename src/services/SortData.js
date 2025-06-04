class SortData {
   mergeData = (leftData, rightData) => {
      let mergedData = [];
      let i = 0,
         j = 0;
      while (i < leftData.length && j < rightData.length) {
         if (leftData[i] <= rightData[j]) {
            mergedData.push(leftData[i]);
            i++;
         } else {
            mergedData.push(rightData[j]);
            j++;
         }
      }
      let leftDataTail = leftData.filter((d, l) => l >= i);
      let rightDataTail = rightData.filter((d, r) => r >= j);
      return mergedData.concat(leftDataTail?.concat(rightDataTail));
   };

   sortData = (data, depth = 0) => {
      if (data.length < 2) return data;
      let midValue = Math.round(data.length / 2);
      let leftData = data?.filter((d, i) => i < midValue);
      let rightData = data?.filter((d, i) => i >= midValue);
      let leftSortData = this.sortData(leftData, depth + 1);
      let rightSortData = this.sortData(rightData, depth + 1);
      let sortedData = this.mergeData(leftSortData, rightSortData);
      return sortedData;
   };
}
export default SortData;