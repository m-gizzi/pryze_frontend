import React, { Component} from "react"
import ReactMapGL, { 
    Marker, 
    Popup, 
    FlyToInterpolator, 
    WebMercatorViewport 
} from "react-map-gl"
import { easeQuad} from "d3-ease"

export default class ResultsMap extends Component {
    constructor() {
        super()
        this.state = {
            viewport: {
                latitude: 41.881832,
                longitude: -87.623177,
                zoom: 10,
                width: "50vw",
                height: "50vh",
                maxZoom: 16
            },
            selectedFundraiser: null
        }
    }

    componentDidUpdate = () => {
        if (document.getElementsByClassName("mapboxgl-popup-close-button").length > 0) {
            const x = document.getElementsByClassName("mapboxgl-popup-close-button")[0]
            x.addEventListener('click', this.handleClick)
        }
    }

    recenterMap = () => {
        if (this.props.currentGame.game) {
            const latArray = this.props.currentGame.game.donations.map(donationEntry => {
                return donationEntry.fundraiser.latitude
            }).sort()

            const longArray = this.props.currentGame.game.donations.map(donationEntry => {
                return donationEntry.fundraiser.longitude
            }).sort()

            const minMaxArray = [[longArray[0], latArray[0]], [longArray[longArray.length - 1], latArray[latArray.length - 1]]]

            const originalViewport = new WebMercatorViewport(this.state.viewport)
            const {longitude, latitude, zoom} = originalViewport.fitBounds(minMaxArray, {
                padding: 40
            })

            this.setState({
                viewport: {
                  ...this.state.viewport,
                  longitude,
                  latitude,
                  zoom,
                  bearing: 0,
                  pitch: 0,
                  transitionDuration: 2000,
                  transitionInterpolator: new FlyToInterpolator({}),
                  transitionEasing: easeQuad
                }
            })
        }
    }

    renderMarkers = () => {
        return this.props.currentGame.game.donations.map(donationEntry => {
            return <Marker key={`marker-${donationEntry.donation.id}`} 
                latitude={donationEntry.fundraiser.latitude}
                longitude={donationEntry.fundraiser.longitude}>
                    <button className='marker-btn' onClick={() => this.handleClick(donationEntry)}><img src="/map-pushpin.svg" alt="Fundraiser Location"/></button>
            </Marker>
        })
    }

    handleClick = (donationEntry) => {
        this.setState({
            selectedFundraiser: donationEntry
        })
    }

    handleClose = () => {
        this.setState({
            selectedFundraiser: null
        })
    }

    render = () => {
        if (this.props.currentGame.game) {
            return (
                <div><button onClick={this.recenterMap}>Return map to starting point</button>
                    <ReactMapGL 
                        {...this.state.viewport}
                        onLoad={this.recenterMap}
                        mapboxApiAccessToken="pk.eyJ1IjoibWdpenppM3J1IiwiYSI6ImNrOHQyemNmZjBhY3kzZW12ZmYycGJjMGUifQ.HDKamhzm23YZU9P54Dsibg"
                        onViewportChange={viewport => {
                            this.setState({
                                viewport: viewport
                            })
                        }}
                        >

                        {this.renderMarkers()}

                        {this.state.selectedFundraiser && this.state.selectedFundraiser.fundraiser ? 
                            <Popup 
                                latitude={this.state.selectedFundraiser.fundraiser.latitude} 
                                longitude={this.state.selectedFundraiser.fundraiser.longitude}
                                >

                                    <h4>{this.state.selectedFundraiser.fundraiser.name}</h4>
                                    <div id="fundraiser-link"><a href={this.state.selectedFundraiser.fundraiser.url}>Link</a></div>

                            </Popup>
                        : null}
                    </ReactMapGL>
                </div>
            )
        } else {
            return null
        }
    }
}