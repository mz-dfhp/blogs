/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */

function search(nums: number[], target: number) {
  let start = 0;
  let end = nums.length - 1;

  while (start <= end) {
    let mid = Math.floor((start + end) / 2);

    // 如果目标元素等于中间元素，返回其索引
    if (nums[mid] === target) {
      return mid;
    }

    // 如果目标元素小于中间元素，更新结束位置为mid-1
    if (target < nums[mid]) {
      end = mid - 1;
    }

    // 如果目标元素大于中间元素，更新起始位置为mid+1
    else {
      start = mid + 1;
    }
  }

  // 如果找不到目标元素，返回-1
  return -1;
}

// 测试
const array = [1, 3, 5, 7, 9];
const target = 9;
const index = search(array, target);
console.log(index); // 输出：4

function removeElement(nums: number[], val: number): number {
  let k = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== val) {
      nums[k] = nums[i];
      k++;
    }
  }
  return k;
}

removeElement([3, 2, 2, 3], 2);
function sortedSquares(nums: number[]): number[] {
  let left = 0;
  let right = nums.length - 1;
  let end = nums.length - 1;
  let result = new Array(nums.length - 1).fill(0);

  while (right >= left) {
    let leftResult = nums[left] * nums[left];
    let rightResult = nums[right] * nums[right];
    if (leftResult < rightResult) {
      result[end] = rightResult;
      right--;
    } else {
      result[end] = leftResult;
      left++;
    }
    end--;
  }
  return result;
}
