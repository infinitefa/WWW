<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
<xsl:template match="/">
<html>
<body>
<xsl:for-each select="mixedteams/baseball">
<table border="2">
<xsl:attribute name="style">background-color:<xsl:value-of select="BColor"/>;color:<xsl:value-of select="Color"/></xsl:attribute>
<tr>
<th colspan="5"><b>
<xsl:value-of select="Team"/>
</b></th>
</tr>
<tr>
<th>Image</th>
<th colspan="2">star</th>
<th>coach</th>
<th>League</th>
</tr>
<tr>
<td>
<xsl:element name="img">
<xsl:attribute name="src">
<xsl:value-of select="Image"/>
</xsl:attribute>
<xsl:attribute name="height">40</xsl:attribute>
<xsl:attribute name="width">40</xsl:attribute>
</xsl:element></td>
<td><xsl:value-of select="star/name"/></td>
<td>Birth:<xsl:value-of select="star/birth"/></td>
<td><xsl:value-of select="Coach"/></td>
<td><xsl:value-of select="League"/></td>
</tr>
<tr>
<th colspan="5">
<xsl:element name="iframe">
<xsl:attribute name="src">
<xsl:value-of select="Video"/>
</xsl:attribute>
<xsl:attribute name="height">315</xsl:attribute>
<xsl:attribute name="width">560</xsl:attribute>
allowfullscreen
</xsl:element></th>
</tr>
</table>
</xsl:for-each>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
