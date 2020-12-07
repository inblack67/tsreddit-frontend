import Moment from 'react-moment';
import PropTypes from 'prop-types';

const FormatDate = ( { createdAt } ) =>
{
    return <Moment date={ new Date( parseFloat( createdAt ) ) } format='MMMM Do YYYY' />;
};

FormatDate.propTypes = {
    createdAt: PropTypes.string.isRequired,
};

export default FormatDate;
