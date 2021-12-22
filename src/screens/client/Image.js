import React from 'react'
import {SafeAreaView, ActivityIndicator} from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'
import createStyles from '../../styles/base'

const Image = ({route}) => {
	const {selectedImage} = route.params

	const images = [
		{
			url: selectedImage
		}
	]
	return (
		<SafeAreaView style={styles.settingsContainer}>
			<ImageViewer imageUrls={images} renderIndicator={() => null} loadingRender={() => <ActivityIndicator />} />
		</SafeAreaView>
	)
}

const styles = createStyles()

export default Image
