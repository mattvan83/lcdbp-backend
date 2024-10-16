/**
 * Checks if the given body object has all the given keys and
 * if the corresponding values are not empty.
 *
 * @param {object} body - The object to check.
 * @param {string[]} keys - An array of keys to check.
 * @returns {boolean} A boolean indicating if the check is valid.
 */
function checkBody(body, keys) {
  let isValid = true;

  for (const field of keys) {
    if (body[field] === undefined || body[field] === "") {
      isValid = false;
    }
  }

  return isValid;
}

/**
 * Checks the validity of voice recordings and their descriptions.
 *
 * This function verifies if the provided voice recordings and descriptions are either both undefined,
 * or if they are both arrays of equal length with non-empty descriptions.
 * It returns true if the conditions are met, otherwise false.
 *
 * @param {Array|undefined} voiceRecordingsFromFront - An array of voice recordings or undefined.
 * @param {Array|string|undefined} voiceRecordingDescriptions - An array of descriptions or a string or undefined.
 * @returns {boolean} Returns true if the recordings and descriptions are valid, otherwise false.
 */
function checkWorkRecording(
  voiceRecordingsFromFront,
  voiceRecordingDescriptions
) {
  if (
    voiceRecordingsFromFront === undefined &&
    voiceRecordingDescriptions === undefined
  ) {
    return true;
  } else if (
    !Array.isArray(voiceRecordingsFromFront) &&
    voiceRecordingsFromFront &&
    !Array.isArray(voiceRecordingDescriptions) &&
    voiceRecordingDescriptions.trim() !== ""
  ) {
    return true;
  } else if (
    Array.isArray(voiceRecordingsFromFront) &&
    Array.isArray(voiceRecordingDescriptions)
  ) {
    return (
      voiceRecordingsFromFront.length === voiceRecordingDescriptions.length &&
      voiceRecordingDescriptions.every(
        (description) => description.trim() !== ""
      )
    );
  }
  return false;
}

module.exports = { checkBody, checkWorkRecording };
